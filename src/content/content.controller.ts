import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Content } from 'src/entities/content.entitiy';
import { UpdateContentDto } from 'src/dto/updateContent.dto';
import { CreateContentDto } from 'src/dto/createContent.dto';
import {
  contentCategoriesArray,
  ContentCategory,
} from 'src/types/content.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserContentMaps } from 'src/entities/userContentMaps.entity';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  //get all contents
  @Get()
  @ApiOperation({
    operationId: 'getAllContents',
    description: 'Get all contents',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully get all contents',
    type: [Content],
  })
  async getAllContents(@Query('thumbnail') thumbnail: boolean) {
    return await this.contentService.getAllContents(thumbnail);
  }

  @Get('me')
  @ApiOperation({
    operationId: 'getUserContents',
    description: 'Get user enrolled contents',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully get enrolled contents',
    type: [UserContentMaps],
  })
  async getUserContents(@Req() req) {
    const user = req.user as { userId: string };
    const userId = user.userId;
    return await this.contentService.getUserContents(userId);
  }

  //create content
  @Roles('admin')
  @Post('create')
  @ApiOperation({ description: 'Create content' })
  @ApiResponse({
    status: 201,
    description: 'Successfully create content',
    type: Content,
  })
  async createContent(@Req() req, @Body() createContentDto: CreateContentDto) {
    const user = req.user as { userId: string };
    const userId = user.userId;
    return await this.contentService.createContent(createContentDto, userId);
  }

  //update content
  @Patch(':contentId/update')
  @ApiOperation({
    operationId: 'updateContent',
    description: 'Update content',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully update content',
    type: Content,
  })
  async updateContent(
    @Param('contentId') contentId: string,
    @Body() updateContentDto: UpdateContentDto,
  ) {
    return await this.contentService.updateContent(contentId, updateContentDto);
  }

  //filter content by category
  @Get('filter/:category')
  @ApiOperation({
    operationId: 'filterContentByCategory',
    description: 'Filter content by category',
  })
  @ApiParam({
    name: 'category',
    enum: contentCategoriesArray,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully filter content by category',
    type: [Content],
  })
  async filterContentByCategory(@Param('category') category: ContentCategory) {
    return await this.contentService.filterContentByCategory(category);
  }

  @Delete(':contentId')
  @ApiOperation({
    operationId: 'deleteContent',
    description: 'Delete content',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully delete content',
    type: Content,
  })
  async deleteContent(@Param('contentId') contentId: string) {
    return await this.contentService.deleteContent(contentId);
  }

  @Get(':contentId')
  @ApiOperation({
    operationId: 'getContentById',
    description: 'Get content by Id',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully get content',
    type: Content,
  })
  async getContentById(@Param('contentId') contentId: string) {
    return await this.contentService.getContentById(contentId);
  }

  @ApiOperation({
    operationId: 'enroll',
    description: 'Enroll to a content',
  })
  @Post('enroll/:contentId')
  async enrollContent(@Req() req, @Param('contentId') contentId: string) {
    const user = req.user as { userId: string };
    const userId = user.userId;
    return await this.contentService.enrollContent(contentId, userId);
  }

  @ApiOperation({
    operationId: 'complete',
    description: 'Complete an enrolled content',
  })
  @Patch('complete/:contentId')
  async completeContent(@Req() req, @Param('contentId') contentId: string) {
    const user = req.user as { userId: string };
    const userId = user.userId;
    return await this.contentService.completeContent(contentId, userId);
  }
}
