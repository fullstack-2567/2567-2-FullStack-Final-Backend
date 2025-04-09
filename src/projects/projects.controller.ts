import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Project } from 'src/entities/project.entity';
import { UpdateProjectStatusDto } from 'src/dto/updateProjectStatus.dto';
import { SubmitProjectDto } from 'src/dto/submitProject.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiCookieAuth('access_token')
@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Roles('project-approver')
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
    description:
      'Successfully retrieved project with presigned URL for project description file',
    type: Project,
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
  })
  async getProjectById(@Param('projectId') projectId: string) {
    return await this.projectsService.getProjectById(projectId);
  }

  @Get('user-projects')
  @ApiOperation({ description: 'Get projects by user ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved projects by user ID',
    type: [Project],
  })
  @ApiResponse({
    status: 404,
    description: 'No projects found for this user',
  })
  async getUserProjects(@Req() req) {
    const user = req.user as { userId: string };
    const userId = user.userId;
    return await this.projectsService.getUserProjects(userId);
  }

  @Roles('project-approver')
  @Patch(':projectId/status')
  @ApiOperation({
    description: 'Update project status',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully update project status',
    type: Project,
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Project already fully approved',
  })
  async updateProjectStatus(
    @Req() req,
    @Param('projectId') projectId: string,
    @Body() updateProjectStatusDto: UpdateProjectStatusDto,
  ) {
    const user = req.user as { userId: string };
    const userId = user.userId;
    return await this.projectsService.updateProjectStatus(
      projectId,
      updateProjectStatusDto,
      userId,
    );
  }

  @Post('submit')
  @ApiOperation({
    description:
      'Submit a project, returns projectDescriptionFile as accessible url.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Successfully submit a project with presigned URL for project description file',
    type: Project,
  })
  @ApiResponse({
    status: 400,
    description: 'User not found.',
  })
  async submitProject(@Req() req, @Body() project: SubmitProjectDto) {
    const user = req.user as { userId: string };
    const userId = user.userId;
    return await this.projectsService.submitProject(project, userId);
  }
}
