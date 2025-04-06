import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateContentDto } from 'src/dto/createContent.dto';
import { UpdateContentDto } from 'src/dto/updateContent.dto';
import { Content } from 'src/entities/content.entitiy';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';

ffmpeg.setFfmpegPath(ffmpegPath as string);

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Content) private readonly contentRepository: typeof Content,
  ) {}

  //get all contents
  async getAllContents() {
    const contents = await this.contentRepository.findAll({
      order: [['updatedAt', 'DESC']],
    });
    return contents;
  }

  //create content
  async createContent(createContentDto: CreateContentDto) {
    const { contentVideoLink } = createContentDto;

    // ดึง video_duration จาก content_video_link
    const videoDuration = await this.getVideoDuration(contentVideoLink);

    const content = await this.contentRepository.create({
      ...createContentDto,
      video_duration: videoDuration,
    });

    return content;
  }

  // function ใช้ ffmpeg เพื่อดึง duration ของ video
  async getVideoDuration(videoUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      ffmpeg(videoUrl).ffprobe(0, (err, metadata) => {
        if (err) reject(err instanceof Error ? err : new Error(String(err)));
        const duration = metadata.format.duration;
        if (duration === undefined) {
          reject(new Error('Unable to retrieve video duration'));
        } else {
          resolve(this.formatDuration(duration));
        }
      });
    });
  }

  // function format duration to hh:mm:ss
  formatDuration(duration: number): string {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
    return `${hours}:${minutes}:${seconds}`;
  }

  //update content
  async updateContent(contentId: string, updateContentDto: UpdateContentDto) {
    const content = await this.contentRepository.findOne({
      where: { contentId: contentId },
    });

    if (!content) {
      throw new Error('Content not found');
    }
    await content.update(updateContentDto);
    return content;
  }

  //filter content by category
  async filterContentByCategory(category: string) {
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
    return { message: 'Content deleted successfully' };
  }
}
