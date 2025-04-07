import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

@Table
export class ContentMaps extends Model {
  @ApiProperty({
    description: 'Unique identifier of the content map',
    example: 1,
    type: Number,
  })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  contentMapsId: number;

  @ApiProperty({
    description: 'ID of the user who enrolled the content',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @ApiProperty({
    description: 'ID of the content',
    example: 1,
    type: Number,
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  contentId: number;

  @ApiProperty({
    description: 'Date when the user enrolled the content',
    example: '2024-01-01T00:00:00Z',
    type: Date,
  })
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  enrollAt: Date;

  @ApiProperty({
    description: 'Progress of the content',
    example: 0,
    type: Number,
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  progress: number;

  @ApiProperty({
    description: 'Date when the user completed the content',
    example: '2024-01-01T00:00:00Z',
    type: Date,
    nullable: true,
  })
  @Column(DataType.DATE)
  completeAt: Date | null;
}
