import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    PrimaryKey,
    Index,
  } from 'sequelize-typescript';
  import { ApiProperty } from '@nestjs/swagger';
  import { User } from './user.entity';
  import { Content } from './content.entity';
  
  @Table({
    tableName: 'ContentMap',
    timestamps: false,
  })
  export class ContentMap extends Model {
    @ApiProperty({
      description: 'Unique identifier of the content map',
      example: 'cabfd2be-03b9-4035-b46c-ac86b04704ea',
      format: 'uuid',
    })
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
      })
    contentMapsId: string;
  
    @ApiProperty({
      description: 'User ID who enrolled in the content',
      format: 'uuid',
      example: '6c8df628-e54b-4373-bf3e-552fc58d02ca',
    })
    @ForeignKey(() => User)
    @Index('ContentMaps_userId_idx')
    @Column({
      type: DataType.UUID,
      allowNull: false,
    })
    userId: string;

    @BelongsTo(() => User, 'userId')
    user: User;
  
    @ApiProperty({
      description: 'ID of the content',
      format: 'uuid',
      example: 'ce1ab3ee-796e-4abd-988e-c1fac1f408ce',
    })
    @ForeignKey(() => Content)
    @Index('ContentMaps_contentId_idx')
    @Column({
      type: DataType.UUID,
      allowNull: false,
    })
    contentId: string;

    @BelongsTo(() => Content, 'contentId')
    content: Content;
  
    @ApiProperty({
      description: 'Enrollment timestamp',
      format: 'date-time',
      example: '2023-10-01T12:00:00Z',
    })
    @Column({
      type: DataType.DATE,
      allowNull: false,
      defaultValue: DataType.NOW,
    })
    enrollAt: Date;
  
    @ApiProperty({
      description: 'Progress percentage (0-100)',
      example: 50,
      format: 'int32',
    })
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    })
    progress: number;
  
    @ApiProperty({
      description: 'Completion timestamp (nullable)',
      format: 'date-time',
      required: false,
      example: '2023-10-01T12:00:00Z',
    })
    @Column({
      type: DataType.DATE,
      allowNull: true,
    })
    completeAt: Date;
  
  }
  