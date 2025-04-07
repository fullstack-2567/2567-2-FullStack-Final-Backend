import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  //get all contents
  @Get()
  @ApiOperation({ description: 'Get all contents' })
  @ApiResponse({
    status: 200,
    description: 'Successfully get all contents',
    type: [Content],
  })
  async getAllContents() {
    return await this.contentService.getAllContents();
  }

  //create content
  @Post('create')
  @ApiOperation({ description: 'Create content' })
  @ApiResponse({
    status: 201,
    description: 'Successfully create content',
    type: Content,
  })
  async createContent(@Body() createContentDto: CreateContentDto) {
    return await this.contentService.createContent(createContentDto);
  }

  //update content
  @Patch(':contentId/update')
  @ApiOperation({ description: 'Update content' })
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
  @ApiOperation({ description: 'Filter content by category' })
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
  @ApiOperation({ description: 'Delete content' })
  @ApiResponse({
    status: 200,
    description: 'Successfully delete content',
    type: Content,
  })
  async deleteContent(@Param('contentId') contentId: string) {
    return await this.contentService.deleteContent(contentId);
  }

  @Get(':contentId')
  @ApiOperation({ description: 'Get content by Id' })
  @ApiResponse({
    status: 200,
    description: 'Successfully get content',
    type: Content,
  })
  async getContentById(@Param('contentId') contentId: string) {
    return await this.contentService.getContentById(contentId);
  }
}
