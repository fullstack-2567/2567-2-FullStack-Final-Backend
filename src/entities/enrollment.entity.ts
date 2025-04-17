import {
  Model,
  Column,
  DataType,
  Table,
  ForeignKey,
  PrimaryKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.entity';
import { Content } from './content.entitiy';
import { ApiProperty } from '@nestjs/swagger';

@Table({
  tableName: 'Enrollment',
  timestamps: false,
})
export class Enrollment extends Model {
  @ApiProperty({
    description: 'ID of the user who enrolled in the content',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @PrimaryKey
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @ApiProperty({
    description: 'User who enrolled in the content',
    type: () => User,
  })
  @BelongsTo(() => User)
  user: User;

  @ApiProperty({
    description: 'ID of the content in which the user enrolled',
    example: '987e6543-a21c-43d3-a999-426614174999',
    format: 'uuid',
  })
  @PrimaryKey
  @ForeignKey(() => Content)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  contentId: string;

  @ApiProperty({
    description: 'Content that the user enrolled in',
    type: () => Content,
  })
  @BelongsTo(() => Content)
  content: Content;

  @ApiProperty({
    description: 'Timestamp when the user enrolled in the content',
    example: '2025-04-01T10:00:00Z',
    format: 'date-time',
  })
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    allowNull: false,
  })
  enrolledDT: Date;

  @ApiProperty({
    description: 'Timestamp when the user completed the content',
    example: '2025-04-03T15:30:00Z',
    format: 'date-time',
  })
  @Column({
    type: DataType.DATE,
  })
  completedDT: Date;
}
