import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateContentDto } from 'src/dto/createContent.dto';
import { UpdateContentDto } from 'src/dto/updateContent.dto';
import { Content } from 'src/entities/content.entitiy';
import * as ffmpeg from 'fluent-ffmpeg';
import * as ffmpegPath from 'ffmpeg-static';
import * as ffprobePath from 'ffprobe-static';
import { InjectMinio } from 'nestjs-minio';
import { Client } from 'minio';
import * as stream from 'stream';
import { getPresignedUrl, putObjectFromBase64 } from 'src/utils/minio.utils';
import { ContentCategory } from 'src/types/content.enum';
import { Enrollment } from 'src/entities/enrollment.entity';

// Set ffmpeg and ffprobe paths correctly
ffmpeg.setFfmpegPath(ffmpegPath as unknown as string);
ffmpeg.setFfprobePath(ffprobePath.path);

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Content) private readonly contentRepository: typeof Content,
    @InjectModel(Enrollment)
    private readonly enrollmentRepository: typeof Enrollment,
    @InjectMinio() private readonly minioClient: Client,
  ) {}

  //get all contents
  async getAllContents(thumbnail: boolean = false) {
    const contents = await this.contentRepository.findAll({
      order: [['updatedDT', 'DESC']],
      include: ['createdByUser'],
    });

    // Get presigned URLs for content thumbnails
    if (thumbnail) {
      for (const content of contents) {
        content.dataValues.contentThumbnail = await getPresignedUrl(
          this.minioClient,
          'pictures',
          content.contentThumbnail,
        );
      }
    }

    return contents;
  }

  async getUserContents(userId: string) {
    const enrollments = await this.enrollmentRepository.findAll({
      order: [['enrolledDT', 'DESC']],
      where: {
        userId: userId,
      },
      include: ['content'],
    });

    const enrolledContents = await Promise.all(
      enrollments.map(async (enrollment) => {
        return {
          ...enrollment.dataValues,
          content: {
            ...enrollment.content.dataValues,
            contentThumbnail: await getPresignedUrl(
              this.minioClient,
              'pictures',
              enrollment.content.contentThumbnail,
            ),
          },
        };
      }),
    );

    return enrolledContents;
  }

  //create content
  async createContent(createContentDto: CreateContentDto, userId: string) {
    const { contentVideo, contentThumbnail } = createContentDto;

    const videoObjectName = await putObjectFromBase64(
      this.minioClient,
      contentVideo,
      'videos',
    );

    const thumbnailObjectName = await putObjectFromBase64(
      this.minioClient,
      contentThumbnail,
      'pictures',
    );

    // ดึง video_duration จาก content_video_link
    const videoDuration = await this.getVideoDuration(contentVideo);

    const content = await this.contentRepository.create(
      {
        ...createContentDto,
        contentVideo: videoObjectName,
        contentThumbnail: thumbnailObjectName,
        videoDuration: videoDuration,
        createdByUserId: userId,
      },
      {
        include: ['createdByUser'],
      },
    );

    return content;
  }

  // function ใช้ ffmpeg เพื่อดึง duration ของ video
  async getVideoDuration(videoBase64: string): Promise<number> {
    return new Promise((resolve, reject) => {
      // Create a temporary buffer from the base64 string
      try {
        // Remove potential data URL prefix (e.g., "data:video/mp4;base64,")
        const base64Data = videoBase64.replace(/^data:video\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // Create a temporary file path in memory
        const bufferStream = new stream.PassThrough();
        bufferStream.end(buffer);

        ffmpeg(bufferStream).ffprobe(0, (err, metadata) => {
          if (err) {
            reject(err instanceof Error ? err : new Error(String(err)));
            return;
          }

          const duration = metadata.format.duration;
          if (duration === undefined) {
            reject(new Error('Unable to retrieve video duration'));
          } else {
            resolve(Math.floor(duration));
          }
        });
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }

  //update content
  async updateContent(contentId: string, updateContentDto: UpdateContentDto) {
    const content = await this.contentRepository.findOne({
      where: { contentId: contentId },
    });

    if (!content) {
      throw new Error('Content not found');
    }

    const updatedContent = await content.update(updateContentDto);
    return updatedContent;
  }

  //filter content by category
  async filterContentByCategory(category: ContentCategory) {
    const contents = await this.contentRepository.findAll({
      where: { contentCategory: category },
    });
    return contents;
  }

  async deleteContent(contentId: string) {
    const content = await this.contentRepository.findOne({
      where: { contentId: contentId },
    });

    if (!content) {
      throw new Error('Content not found');
    }
    await content.destroy();

    await this.minioClient.removeObject('videos', content.contentVideo);
    await this.minioClient.removeObject('pictures', content.contentThumbnail);

    return { message: 'Content deleted successfully' };
  }

  async getContentById(contentId: string) {
    const content = await this.contentRepository.findOne({
      where: { contentId: contentId },
      include: ['createdByUser'],
    });

    if (!content) {
      throw new Error('Content not found');
    }

    const videoObjectUrl = await getPresignedUrl(
      this.minioClient,
      'videos',
      content.contentVideo,
    );
    const thumbnailObjectUrl = await getPresignedUrl(
      this.minioClient,
      'pictures',
      content.contentThumbnail,
    );

    return {
      ...content.dataValues,
      contentVideo: videoObjectUrl,
      contentThumbnail: thumbnailObjectUrl,
    };
  }

  async enrollContent(contentId: string, userId: string) {
    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: {
        userId: userId,
        contentId: contentId,
      },
    });

    if (existingEnrollment) {
      throw new Error('Content already enrolled');
    }

    const enrollment = await this.enrollmentRepository.create({
      userId: userId,
      contentId: contentId,
    });
    return {
      status: 'success',
      data: enrollment,
    };
  }

  async completeContent(contentId: string, userId: string) {
    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: {
        userId: userId,
        contentId: contentId,
      },
    });

    if (!existingEnrollment) {
      throw new Error('Content not enrolled');
    }

    await this.enrollmentRepository.update(
      { completedDT: new Date() },
      {
        where: {
          userId: userId,
          contentId: contentId,
        },
      },
    );
    const updatedEnrollment = await this.enrollmentRepository.findOne({
      where: {
        userId: userId,
        contentId: contentId,
      },
    });

    return {
      status: 'success',
      data: updatedEnrollment,
    };
  }
}
