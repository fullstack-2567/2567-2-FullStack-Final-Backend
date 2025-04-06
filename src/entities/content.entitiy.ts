import { Model, Column, DataType, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

/**มี contentId
 * contentName
 * contentDescription
 * contentCategory
 * create_at
 * update_at
 * contentThumbnail
 * contentVideoLink
 * video_duration
 * is_public
 */
@Table({
  tableName: 'Content',
  timestamps: true,
})
export class Content extends Model {
  @ApiProperty({
    description: 'Unique identifier of the content',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  contentId: string;

  @ApiProperty({
    description: 'Name of the content',
    example: 'Funny Cat Video',
    minLength: 1,
    maxLength: 255,
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  contentName: string;

  @ApiProperty({
    description: 'Description of the content',
    example: 'A video showing funny moments of cats',
    minLength: 1,
    maxLength: 1000,
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  contentDescription: string;

  @ApiProperty({
    description: 'Category of the content',
    example: 'Comedy',
  })
  @Column({
    type: DataType.STRING, //enum
    allowNull: false,
  })
  contentCategory: string;

  @ApiProperty({
    description: 'Thumbnail image URL (S3 link)',
    example: 'https://s3.amazonaws.com/bucket/thumbnail.jpg',
    required: false,
  })
  @Column({ type: DataType.STRING, allowNull: true })
  contentThumbnail: string;

  @ApiProperty({
    description: 'Video file URL (S3 link)',
    example: 'https://s3.amazonaws.com/bucket/video.mp4',
    required: false,
  })
  @Column({ type: DataType.STRING, allowNull: true })
  contentVideoLink: string;

  @ApiProperty({ example: '00:45:32', description: 'Video duration' })
  @Column({
    type: DataType.STRING,
  })
  video_duration: string;

  @ApiProperty({
    description: 'Is the content publicly available',
    example: true,
  })
  @Column({ type: DataType.BOOLEAN, allowNull: true })
  is_public: boolean;

  //   @ApiProperty({
  //     description: 'Creation date of the content',
  //     example: '2024-01-01T10:00:00Z',
  //     format: 'date-time',
  //     required: false,
  //   })
  //   @Column({ type: DataType.DATE, allowNull: true })
  //   create_at: Date;

  //   @ApiProperty({
  //     description: 'Last update date of the content',
  //     example: '2024-01-15T12:00:00Z',
  //     format: 'date-time',
  //     required: false,
  //   })
  //   @Column({ type: DataType.DATE, allowNull: true })
  //   update_at: Date;
}
