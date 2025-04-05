import { Controller, Get } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Project } from 'src/entities/project.entity';

@ApiBearerAuth()
@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ description: 'Get all projects' })
  @ApiResponse({
    status: 200,
    description: 'Successfully get all projects',
    type: [Project],
  })
  async getAllProjects() {
    return await this.projectsService.getAllProjects();
  }
}
