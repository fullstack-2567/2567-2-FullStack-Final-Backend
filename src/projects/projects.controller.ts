import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Project } from 'src/entities/project.entity';
import { UpdateProjectStatusDto } from 'src/dto/updateProjectStatus.dto';
import { SubmitProjectDto } from 'src/dto/submitProject.dto';

@ApiBearerAuth('accessToken')
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

  @Patch(':projectId/status')
  @ApiOperation({ description: 'Update project status' })
  @ApiResponse({
    status: 200,
    description: 'Successfully update project status',
    type: [Project],
  })
  async updateProjectStatus(
    @Param('projectId') projectId: string,
    @Body() updateProjectStatusDto: UpdateProjectStatusDto,
  ) {}

  @Post('submit')
  @ApiOperation({ description: 'Submit a project' })
  @ApiResponse({
    status: 200,
    description: 'Successfully submit a project',
    type: [Project],
  })
  async submitProject(@Body() project: SubmitProjectDto) {}
}
