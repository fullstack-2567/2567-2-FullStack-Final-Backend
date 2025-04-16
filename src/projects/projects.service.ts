import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SubmitProjectDto } from '../dto/submitProject.dto';
import { UpdateProjectStatusDto } from '../dto/updateProjectStatus.dto';
import { Project } from '../entities/project.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectMinio } from 'nestjs-minio';
import { Client } from 'minio';
import { getPresignedUrl, putObjectFromBase64 } from '../utils/minio.utils';
import { Roles } from 'src/auth/decorators/roles.decorator';
@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project) private readonly projectRepository: typeof Project,
    @InjectModel(User) private readonly userRepository: typeof User,
    @InjectMinio() private readonly minioClient: Client,
  ) {}

  async getUserLatestProject(userId: string) {
    const latestProject = await this.projectRepository.findOne({
      where: { submittedByUserId: userId },
      include: [
        'ChildProjects',
        'submittedByUser',
        'firstApprovedByUser',
        'secondApprovedByUser',
        'thirdApprovedByUser',
        'rejectedByUser',
      ],
      order: [['submittedDT', 'DESC']],
    });
  
    if (!latestProject) {
      throw new NotFoundException('No projects found for this user');
    }
  
    // ตรวจสอบสถานะการอนุมัติของโครงการล่าสุด
    const isFullyApproved = latestProject.thirdApprovedDT !== null;
    const isRejected = latestProject.rejectedDT !== null;
    const isPending = !isFullyApproved && !isRejected;
  
    // สร้าง status string ที่อ่านง่าย
    let approvalStatus = 'pending';
    if (isFullyApproved) {
      approvalStatus = 'approved';
    } else if (isRejected) {
      approvalStatus = 'rejected';
    } else if (latestProject.secondApprovedDT !== null) {
      approvalStatus = 'pending_third_approval';
    } else if (latestProject.firstApprovedDT !== null) {
      approvalStatus = 'pending_second_approval';
    } else {
      approvalStatus = 'pending_first_approval';
    }
  
    // สร้าง object URL สำหรับไฟล์รายละเอียดโครงการ
    const objectUrl = await getPresignedUrl(
      this.minioClient,
      'projects',
      latestProject.projectDescriptionFile,
    );
  
    return {
      ...latestProject.dataValues,
      projectDescriptionFile: objectUrl,
      approvalStatus,
      isFullyApproved,
      isRejected,
      isPending,
    };
  }

  async getAllProjects() {
    const projects = await this.projectRepository.findAll({
      include: [
        'ChildProjects',
        'submittedByUser',
        'firstApprovedByUser',
        'secondApprovedByUser',
        'thirdApprovedByUser',
        'rejectedByUser',
      ],
    });
    return projects;
  }

  async getProjectById(projectId: string, userId: string) {
    const project = await this.projectRepository.findOne({
      where: { projectId: projectId },
      include: [
        'ChildProjects',
        'submittedByUser',
        'firstApprovedByUser',
        'secondApprovedByUser',
        'thirdApprovedByUser',
        'rejectedByUser',
      ],
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const user = await this.userRepository.findByPk(userId);

    if (
      project.submittedByUserId !== userId &&
      user &&
      user.role !== 'project-approver'
    ) {
      throw new ForbiddenException(
        'You are not authorized to view this project',
      );
    }

    const objectUrl = await getPresignedUrl(
      this.minioClient,
      'projects',
      project.projectDescriptionFile,
    );

    return {
      ...project.dataValues,
      projectDescriptionFile: objectUrl,
    };
  }

  async getUserProjects(userId: string) {
    const projects = await this.projectRepository.findAll({
      where: { submittedByUserId: userId },
      include: [
        'ChildProjects',
        'submittedByUser',
        'firstApprovedByUser',
        'secondApprovedByUser',
        'thirdApprovedByUser',
        'rejectedByUser',
      ],
    });
    if (!projects || projects.length === 0) {
      throw new NotFoundException('No projects found for this user');
    }
    return projects;
  }

  async updateProjectStatus(
    projectId: string,
    updateProjectStatusDto: UpdateProjectStatusDto,
    approverId: string,
  ) {
    const { action } = updateProjectStatusDto;

    const project = await this.projectRepository.findOne({
      where: { projectId: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const now = new Date();
    //update project status by action
    switch (action) {
      case 'approve':
        // if project.firstApprovedDT is null and project.firstApprovedByUserId is null
        if (!project.firstApprovedDT && !project.firstApprovedByUserId) {
          project.firstApprovedDT = now;
          project.firstApprovedByUserId = approverId;
        }
        // if project.firstApprovedDT is not null and project.firstApprovedByUserId is not null
        else if (!project.secondApprovedDT && !project.secondApprovedByUserId) {
          project.secondApprovedDT = now;
          project.secondApprovedByUserId = approverId;
        }
        //if project secondApprovedDT is not null and project.secondApprovedByUserId is not null
        else if (!project.thirdApprovedDT && !project.thirdApprovedByUserId) {
          project.thirdApprovedDT = now;
          project.thirdApprovedByUserId = approverId;
          project.endDate = now;
        } else {
          throw new BadRequestException('Project already fully approved');
        }
        break;
      case 'reject':
        project.rejectedDT = now;
        project.rejectedByUserId = approverId;
        break;
    }

    // บันทึกการเปลี่ยนแปลง
    await project.save();

    // Reload the model with associations
    return await this.projectRepository.findOne({
      where: { projectId: projectId },
      include: [
        'ChildProjects',
        'submittedByUser',
        'firstApprovedByUser',
        'secondApprovedByUser',
        'thirdApprovedByUser',
        'rejectedByUser',
      ],
    });
  }

  async submitProject(project: SubmitProjectDto, userId: string) {
    const existingUser = await this.userRepository.findByPk(userId);

    if (!existingUser) {
      throw new BadRequestException('User not found');
    }

    if (
      (!existingUser.prefix && !project.userInfo?.prefix) ||
      (!existingUser.sex && !project.userInfo?.sex) ||
      (!existingUser.education && !project.userInfo?.education) ||
      (!existingUser.firstName && !project.userInfo?.firstName) ||
      (!existingUser.lastName && !project.userInfo?.lastName) ||
      (!existingUser.birthDate && !project.userInfo?.birthDate) ||
      (!existingUser.tel && !project.userInfo?.tel)
    ) {
      throw new BadRequestException('User information is not complete');
    }

    // check userInfo is not null
    if (project.userInfo) {
      // Update user informat
      await this.userRepository.update(project.userInfo, {
        where: { userId: userId },
      });
    }

    const fileName = await putObjectFromBase64(
      this.minioClient,
      project.projectDescriptionFile,
      'projects',
    );

    const objectUrl = await getPresignedUrl(
      this.minioClient,
      'projects',
      fileName,
    );

    const newProject = await this.projectRepository.create(
      {
        ...project,
        submittedByUserId: userId,
        projectDescriptionFile: fileName,
      },
      {
        include: ['ChildProjects', 'submittedByUser'],
      },
    );

    return {
      ...newProject.dataValues,
      projectDescriptionFile: objectUrl,
    };
  }
}
