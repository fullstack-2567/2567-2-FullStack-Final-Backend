import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SubmitProjectDto } from 'src/dto/submitProject.dto';
import { UpdateProjectStatusDto } from 'src/dto/updateProjectStatus.dto';
import { Project } from 'src/entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project) private readonly projectRepository: typeof Project,
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

  async updateProjectStatus(
    projectId: string,
    updateProjectStatusDto: UpdateProjectStatusDto,
  ) {
    const mockupAdminId = '123e4567-e89b-12d3-a456-426614174000';
  }

  async submitProject(project: SubmitProjectDto) {
    const mockupUserId = '123e4567-e89b-12d3-a456-426614174000';
  }
}
