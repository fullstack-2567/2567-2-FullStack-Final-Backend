import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SubmitProjectDto } from '../dto/submitProject.dto';
import { UpdateProjectStatusDto } from '../dto/updateProjectStatus.dto';
import { Project } from '../entities/project.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project) private readonly projectRepository: typeof Project,
    @InjectModel(User) private readonly userRepository: typeof User,
  ) {}

  async getAllProjects() {
    const projects = await this.projectRepository.findAll({
      include: [
        {
          model: Project,
          as: 'ChildProjects',
        },
      ],
    });
    return projects;
  }

  async getProjectById(projectId: string) {
    const project = await this.projectRepository.findOne({
      where: { projectId: projectId },
      include: [
        {
          model: Project,
          as: 'ChildProjects',
        },
      ],
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async getProjectsByUserId(userId: string) {
    const projects = await this.projectRepository.findAll({
      where: { submittedByUserId: userId },
      include: [
        {
          model: Project,
          as: 'ChildProjects',
        },
      ],
    });
    if (!projects) {
      throw new NotFoundException('No projects found for this user');
    }
    return projects;
  }

  async updateProjectStatus(
    projectId: string,
    updateProjectStatusDto: UpdateProjectStatusDto,
  ) {
    const { action } = updateProjectStatusDto;
  
    const mockupAdminId = '123e4567-e89b-12d3-a456-426614174000';

    const project = await this.projectRepository.findOne({ where: { projectId: projectId } });
  
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
          project.firstApprovedByUserId = mockupAdminId;
        }
        // if project.firstApprovedDT is not null and project.firstApprovedByUserId is not null
        else if (!project.secondApprovedDT && !project.secondApprovedByUserId) {
          project.secondApprovedDT = now;
          project.secondApprovedByUserId = mockupAdminId; 
        }
        //if project secondApprovedDT is not null and project.secondApprovedByUserId is not null
        else if (!project.thirdApprovedDT && !project.thirdApprovedByUserId) {
          project.thirdApprovedDT = now;
          project.thirdApprovedByUserId = mockupAdminId; 
          project.endDate = now;
        } else {
          throw new BadRequestException('Project already fully approved');
        }
        break;
  
      case 'reject':
        updateProjectStatusDto.action = 'reject';
        break;
  
      default:
        throw new BadRequestException('Invalid action');
    }
  
    // บันทึกการเปลี่ยนแปลง
    const updatedProject = await project.save();
    return updatedProject;
  }
  

  async submitProject(project: SubmitProjectDto) {
    const mockupUserId = '123e4567-e89b-12d3-a456-426614174000'; 
    const mockupEmail = "john@example.com"
    const projectId = uuidv4(); // Generate a new UUID for the project ID 
  
    const projectData = {
      projectId: projectId,
      submittedByUserId: mockupUserId,
      projectThaiName: project.projectThaiName,
      projectEngName: project.projectEngName,
      projectSummary: project.projectSummary,
      startDate: project.startDate,
      endDate: project.endDate,
      sdgType: project.sdgType,
      projectDescriptionFile: project.projectDescriptionFile,
      projectType: project.projectType,
      parentProjectID: project.parentProjectID || null,
      firstApprovedDT: null,
      firstApprovedByUserId: null,
      secondApprovedDT: null,
      secondApprovedByUserId: null,
      thirdApprovedDT: null,
      thirdApprovedByUserId: null,
      rejectedDT: null,
      rejectedByUserId: null,
    };
   // check userInfo is not null
    if (project.userInfo) {
      const userData = {
        userId: mockupUserId,
        email: mockupEmail,
        prefix: project.userInfo.prefix,
        sex: project.userInfo.sex,
        educationLevel: project.userInfo.educationLevel,
        firstName: project.userInfo.firstName,
        lastName: project.userInfo.lastName,
        birthDate: project.userInfo.birthDate,
        tel: project.userInfo.tel,
      };
  
      // Check if user already exists
      const existingUser = await this.userRepository.findByPk(mockupUserId);
      if (!existingUser) {
        return "User not found Please Login first";
        // await this.userRepository.create(userData); //for mockup if don't have user
      } else {
        // Update user informat
        await this.userRepository.update(userData, {
          where: { userId: mockupUserId },
        });
      }
    }
  
    const newProject = await this.projectRepository.create(projectData);
    console.log('New project created:', newProject);
    console.log('userData:', project.userInfo);

    return newProject;
  }
}
