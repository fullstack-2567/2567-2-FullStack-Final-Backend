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

  @Get(':projectId')
  @ApiOperation({
    description:
      'Get project by ID, returns projectDescriptionFile as accessible url.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved project',
    type: Project,
  })
  async getProjectById(@Param('projectId') projectId: string) {
    return await this.projectsService.getProjectById(projectId);
  }

  @Get('user-projects/:userId')
  @ApiOperation({ description: 'Get projects by user ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved projects by user ID',
    type: [Project],
  })
  async getProjectsByUserId(@Param('userId') userId: string) {
    return await this.projectsService.getProjectsByUserId(userId);
  }

  @Patch(':projectId/status')
  @ApiOperation({
    description: 'Update project status',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully update project status',
    type: Project,
  })
  async updateProjectStatus(
    @Param('projectId') projectId: string,
    @Body() updateProjectStatusDto: UpdateProjectStatusDto,
  ) {
    return await this.projectsService.updateProjectStatus(
      projectId,
      updateProjectStatusDto,
    );
  }

  @Post('submit')
  @ApiOperation({
    description:
      'Submit a project, returns projectDescriptionFile as accessible url.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully submit a project',
    type: Project,
  })
  async submitProject(@Body() project: SubmitProjectDto) {
    return await this.projectsService.submitProject(project);
  }
}
