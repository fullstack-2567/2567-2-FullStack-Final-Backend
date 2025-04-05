import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
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
}
