import {
  Model,
  Column,
  DataType,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import {
  contentCategoriesArray,
  ContentCategory,
} from 'src/types/content.enum';
import { User } from './user.entity';

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
  timestamps: false,
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
    enum: contentCategoriesArray,
  })
  @Column({
    type: DataType.ENUM(...contentCategoriesArray),
    allowNull: false,
  })
  contentCategory: ContentCategory;

  @ApiProperty({
    description: 'Thumbnail image file name in storage',
    example: '1232f565-a106-4160-b6d0-9c859877ce9a.jpg',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  contentThumbnail: string;

  @ApiProperty({
    description: 'Video file name in storage',
    example: '1232f565-a106-4160-b6d0-9c859877ce9a.mp4',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  contentVideo: string;

  @ApiProperty({ example: 60, description: 'Video duration in seconds' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  videoDuration: number;

  @ApiProperty({
    description: 'Is the content publicly available',
    example: true,
  })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isPublic: boolean;

  @ApiProperty({
    description: 'ID of the user who created the content',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  createdByUserId: string;

  @ApiProperty({
    type: () => User,
    description: 'User who created the content',
  })
  @BelongsTo(() => User, 'createdByUserId')
  createdByUser: User;

  @ApiProperty({
    description: 'Creation date of the content',
    example: '2024-01-01T10:00:00Z',
    format: 'date-time',
  })
  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdDT: Date;

  @ApiProperty({
    description: 'Last update date of the content',
    example: '2024-01-15T12:00:00Z',
    format: 'date-time',
  })
  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedDT: Date;
}
