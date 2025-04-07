import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../entities/user.entity';
import { Op } from 'sequelize';
import { ContentMaps } from '../entities/content-maps.entity';
import { Project } from '../entities/project.entity';
import { patchUserByIdDto } from '../dto/patchUserById.dto';
import { UserProgressDto, UserProgressItemDto } from '../dto/userProgress.dto';
import { UserProjectsDto, UserProjectItemDto } from '../dto/userProjects.dto';
import { UserContentsDto, UserContentItemDto } from '../dto/userContents.dto';
import { UserFilesDto, UserFileItemDto } from '../dto/userFiles.dto';
import { UpdateUserStatusDto } from '../dto/userStatus.dto';
import { UserDto } from '../dto/user.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(ContentMaps)
    private contentMapsModel: typeof ContentMaps,
    @InjectModel(Project)
    private projectModel: typeof Project,
  ) {}

  async getAllUsers(
    limit: number = 20,
    offset: number = 0,
    search?: string,
    role?: string,
  ): Promise<{ status: string; data: { total: number; items: User[] } }> {
    const whereClause: any = {};

    if (search) {
      whereClause['[Op.or]'] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    if (role) {
      whereClause.where['roles'] = role;
    }

    const { count, rows } = await this.userModel.findAndCountAll({
      where: whereClause,
      limit: isNaN(limit) ? 20 : limit,
      offset: isNaN(offset) ? 0 : offset,
    });

    return {
      status: 'success',
      data: {
        total: count,
        items: rows,
      },
    };
  }

  async getUserById(userId: string): Promise<{ status: string; data: User }> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException(`User with ID '${userId}' not found`);
    }

    return {
      status: 'success',
      data: user,
    };
  }

  async updateUserById(
    userId: string,
    updateData: patchUserByIdDto,
  ): Promise<{ status: string; data: User }> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException(`User with ID '${userId}' not found`);
    }

    const currentTimestamp = new Date();

    try {
      await this.userModel.update(
        { ...updateData, updatedAt: currentTimestamp },
        {
          where: {
            userId: userId,
          },
        },
      );

      const updatedUser = await this.userModel.findByPk(userId);

      return {
        status: 'success',
        data: updatedUser!,
      };
    } catch (error) {
      console.error('Error updating user:', error);
      throw new BadRequestException('Failed to update user data');
    }
  }

  async getUserProgress(
    userId: string,
  ): Promise<{ status: string; data: UserProgressDto }> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException(`User with ID '${userId}' not found`);
    }

    let progressData;
    try {
      progressData = await this.contentMapsModel.findAll({
        where: {
          userId: userId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve user progress.',
      );
    }

    let totalContents = progressData.length;
    let completedContents = 0;
    let inProgressContents = 0;
    let totalProgress = 0;

    const items: UserProgressItemDto[] = progressData.map((item) => {
      // Dummy data, wait for replace with actual content retrieval
      const contentName = 'Course Title';
      const currentPosition = 450;
      const lastAccessed = item.enrollAt.toISOString();
      const completed = item.progress === 100;

      if (completed) {
        completedContents++;
      } else {
        inProgressContents++;
      }
      totalProgress += item.progress;

      return {
        content_id: 'uuid', // Replace with actual content ID retrieval
        content_name: contentName,
        progress_percentage: item.progress,
        current_position: currentPosition,
        last_accessed: lastAccessed,
        completed: completed,
      };
    });

    const averageProgress =
      totalContents > 0 ? totalProgress / totalContents : 0;

    const result: UserProgressDto = {
      total_contents: totalContents,
      completed_contents: completedContents,
      in_progress_contents: inProgressContents,
      average_progress: averageProgress,
      items: items,
    };

    return {
      status: 'success',
      data: result,
    };
  }

  async getUserProjects(
    userId: string,
    status?: string,
  ): Promise<{ status: string; data: UserProjectsDto }> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException(`User with ID '${userId}' not found`);
    }

    const whereClause: any = {
      submittedByUserId: userId,
    };

    try {
      const { count, rows } = await this.projectModel.findAndCountAll({
        where: whereClause,
      });

      const items: UserProjectItemDto[] = rows.map((project) => {
        let projectStatus: string;

        if (!project.firstApprovedDT && !project.secondApprovedDT && !project.thirdApprovedDT) {
          projectStatus = 'submitted';
        } else if (project.firstApprovedDT && !project.secondApprovedDT && !project.thirdApprovedDT) {
          projectStatus = 'review1';
        } else if (project.secondApprovedDT && !project.thirdApprovedDT) {
          projectStatus = 'review2';
        } else if (project.thirdApprovedDT) {
          projectStatus = 'completed';
        } else {
          projectStatus = 'submitted';
        }

        if (status && projectStatus !== status) {
          return null;
        }

        return {
          project_id: project.projectId,
          project_name: project.projectEngName,
          file_url: project.projectDescriptionFile,
          submitted_at: project.createdAt ? project.createdAt.toISOString() : null,
          status: projectStatus,
        };
      }).filter((item) => item !== null) as UserProjectItemDto[];

      const result: UserProjectsDto = {
        total: items.length,
        items: items,
      };

      return {
        status: 'success',
        data: result,
      };
    } catch (error) {
      console.error('Error retrieving user projects:', error);
      throw new InternalServerErrorException('Failed to retrieve user projects.');
    }
  }

  async getUserContents(
    userId: string,
    status?: string,
  ): Promise<{ status: string; data: UserContentsDto }> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException(`User with ID '${userId}' not found`);
    }

    const whereClause: any = {
      userId: userId,
    };

    if (status === 'enrolled') {
      whereClause.completeAt = { [Op.is]: null };
    } else if (status === 'completed') {
      whereClause.completeAt = { [Op.not]: null };
    }

    try {
      const progressData = await this.contentMapsModel.findAll({
        where: whereClause,
      });

      const items: UserContentItemDto[] = progressData.map((item) => {
        const completed = item.completeAt ? item.completeAt.toISOString() : undefined;
        return {
          content_id: 'dummy-content-id-' + item.contentId, // Mock content ID
          content_name: 'Mock Course Title ' + item.contentId, // Mock content name
          content_description: 'This is a short description for content ' + item.contentId, // Mock description
          content_thumbnail: 'https://via.placeholder.com/150', // Mock thumbnail URL
          enrolled_at: item.enrollAt.toISOString(),
          completed_at: completed,
          progress_percentage: item.progress,
        };
      });

      const result: UserContentsDto = {
        total: items.length,
        items: items,
      };

      return {
        status: 'success',
        data: result,
      };
    } catch (error) {
      console.error('Error retrieving user contents:', error);
      throw new InternalServerErrorException('Failed to retrieve user contents.');
    }
  }

  async updateUserStatus(
    userId: string,
    updateUserStatusDto: UpdateUserStatusDto,
  ): Promise<{ status: string; data: UserDto }> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException(`User with ID '${userId}' not found`);
    }

    const { active } = updateUserStatusDto;

    try {
      await this.userModel.update({ active }, { where: { userId } });

      const updatedUser = await this.userModel.findByPk(userId);

      if (!updatedUser) {
        throw new InternalServerErrorException('Failed to retrieve updated user.');
      }

      const result: UserDto = {
        user_id: updatedUser.userId,
        name: updatedUser.firstName + ' ' + updatedUser.lastName,
        email: updatedUser.email,
        sex: updatedUser.sex,
        birthdate: updatedUser.birthDate,
        created_at: updatedUser.createdAt,
        updated_at: updatedUser.updatedAt,
        roles: updatedUser.role,
        active: updatedUser.active,
      };

      return {
        status: 'success',
        data: result,
      };
    } catch (error) {
      console.error('Error updating user status:', error);
      throw new BadRequestException('Failed to update user status.');
    }
  }

  async getUserFiles(
    userId: string,
    type?: string,
  ): Promise<{ status: string; data: UserFilesDto }> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException(`User with ID '${userId}' not found`);
    }

    // Mockup data based on the response structure
    const mockedFiles = [
      {
        file_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        file_name: 'document_file_name.pdf',
        file_url: 'https://s3-bucket-url/documents/document_file_name.pdf',
        file_size: 5000000,
        file_type: 'document',
        created_at: new Date().toISOString(),
      },
      {
        file_id: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210',
        file_name: 'image_file.jpg',
        file_url: 'https://s3-bucket-url/images/image_file.jpg',
        file_size: 200000,
        file_type: 'image',
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        file_id: '01234567-89ab-cdef-0123-456789abcdef',
        file_name: 'video_file.mp4',
        file_url: 'https://s3-bucket-url/videos/video_file.mp4',
        file_size: 10000000,
        file_type: 'video',
        created_at: new Date(Date.now() - 172800000).toISOString(),
      },
    ];

    // Filter by type if provided
    const filteredFiles = type
      ? mockedFiles.filter((file) => file.file_type === type)
      : mockedFiles;

    const items: UserFileItemDto[] = filteredFiles.map((file) => ({
      file_id: file.file_id,
      file_name: file.file_name,
      file_url: file.file_url,
      file_size: file.file_size,
      file_type: file.file_type,
      created_at: file.created_at,
    }));

    const result: UserFilesDto = {
      total: items.length,
      items: items,
    };

    return {
      status: 'success',
      data: result,
    };
  }

}
