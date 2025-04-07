import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../entities/user.entity';
import { ContentMaps } from '../entities/content-maps.entity';
import { Project } from '../entities/project.entity';
import { patchUserByIdDto } from '../dto/patchUserById.dto';
import { UserProgressDto, UserProgressItemDto } from '../dto/userProgress.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userRepository: typeof User,
    @InjectModel(ContentMaps)
    private contentMapsModel: typeof ContentMaps,
    @InjectModel(Project)
    private projectRepository: typeof Project,
  ) {}

  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users;
  }

  async getUserById(userId: string) {
    const user = await this.userRepository.findByPk(userId);

    if (!user) {
      throw new NotFoundException(`User with ID '${userId}' not found`);
    }

    return user;
  }

  async updateUserById(userId: string, updateData: patchUserByIdDto) {
    const user = await this.userRepository.findByPk(userId);

    if (!user) {
      throw new NotFoundException(`User with ID '${userId}' not found`);
    }

    const now = new Date();

    try {
      await this.userRepository.update(
        { ...updateData, updatedDT: now },
        {
          where: {
            userId: userId,
          },
        },
      );

      const updatedUser = await this.userRepository.findByPk(userId);

      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new BadRequestException('Failed to update user data');
    }
  }

  async getUserProgress(
    userId: string,
  ): Promise<{ status: string; data: UserProgressDto }> {
    const user = await this.userRepository.findByPk(userId);

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

    const result: UserProgressDto = {
      total_contents: totalContents,
      completed_contents: completedContents,
      in_progress_contents: inProgressContents,
      items: items,
    };

    return {
      status: 'success',
      data: result,
    };
  }
}
