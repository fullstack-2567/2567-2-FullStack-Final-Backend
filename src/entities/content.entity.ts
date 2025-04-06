import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    DataType,
    HasMany,
    Model,
    PrimaryKey,
    Table,
  } from 'sequelize-typescript';
import { ContentMap } from './content-map.entity';

 @Table({
    tableName: 'Content',
    timestamps: false,
  })
  export class Content extends Model {
    @ApiProperty({
        description: 'Unique identifier of the content',
        example: 'cabfd2be-03b9-4035-b46c-ac86b04704ea',
        format: 'uuid',
    })
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
    })
    contentId: string;

    @ApiProperty({
        description: 'name of the course',
        example: 'Introduction to Programming',
        minLength: 1,
        maxLength: 255,
      })
    @Column({ type: DataType.STRING, allowNull: false })
    contentName: string;

    @ApiProperty({
        description: 'Category of the course',
        example: 'Computer Science',
      })
      @Column({
        type: DataType.STRING,
        allowNull: true,
      })
      contentCategory: string;

    @HasMany(() => ContentMap, 'contentId')
    contentMaps: ContentMap[];
  }