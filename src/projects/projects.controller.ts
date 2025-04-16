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
import { ProjectIdDto } from 'src/dto/param/projectId.dto';

@ApiCookieAuth('access_token')
@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Roles('project-approver')
  @Get()
  @ApiOperation({
    operationId: 'getAllProjects',
    description: 'Get all projects',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully get all projects',
    type: [Project],
  })
  async getAllProjects() {
    return await this.projectsService.getAllProjects();
  }

  @Get('me')
  @ApiOperation({
    operationId: 'getUserProjects',
    description: 'Get projects by user ID',
  })
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

  @Get(':projectId')
  @ApiOperation({
    operationId: 'getProjectById',
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
  async getProjectById(@Req() req, @Param() { projectId }: ProjectIdDto) {
    const user = req.user as { userId: string };
    const userId = user.userId;
    return await this.projectsService.getProjectById(projectId, userId);
  }

  @Roles('project-approver')
  @Patch(':projectId/status')
  @ApiOperation({
    operationId: 'updateProjectStatus',
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
    @Param() { projectId }: ProjectIdDto,
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
    operationId: 'submitProject',
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

  @Get('me/latest')
  @ApiOperation({
    operationId: 'getUserLatestProject',
    description:
      'Get the latest project submitted by the user with approval status',
  })
  @ApiResponse({
    status: 200,
    description:
      'Successfully retrieved the latest project with approval status',
    type: Project,
  })
  @ApiResponse({
    status: 404,
    description: 'No projects found for this user',
  })
  async getUserLatestProject(@Req() req) {
    const user = req.user as { userId: string };
    const userId = user.userId;
    return await this.projectsService.getUserLatestProject(userId);
  }
}
