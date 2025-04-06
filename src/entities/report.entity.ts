import {
    Table,
    Column,
    DataType,
    Model,
    ForeignKey,
  } from 'sequelize-typescript';
  import { User } from './user.entity';
  import { ApiProperty } from '@nestjs/swagger';
  import { ReportType, reportTypeArray } from 'src/types/enums';
  
  @Table({
    tableName: 'Report',
    timestamps: true,           
    createdAt: 'created_at',
    updatedAt: false,           
  })
  export class Report extends Model {
    @ApiProperty({
      description: 'Unique identifier for the report',
      example: '123e4567-e89b-12d3-a456-426614174000',
      format: 'uuid',
    })
    @Column({
      type: DataType.UUID,
      primaryKey: true,
      defaultValue: DataType.UUIDV4,
    })
    reportId: string;
  
    @ApiProperty({
      description: 'Name of the report file',
      example: 'project_report_2025-04-06.pdf',
    })
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    file_name: string;
  
    @ApiProperty({
      description: 'Type of report',
      enum: reportTypeArray,
      example: ReportType.PROJECT,
    })
    @Column({
      type: DataType.ENUM(...reportTypeArray),
      allowNull: false,
    })
    report_type: ReportType;
  
    @ApiProperty({
      description: 'Created timestamp of the report',
      format: 'date-time',
      example: '2025-04-06T10:20:30Z',
    })
    @Column({
      type: DataType.DATE,
      allowNull: false,
      defaultValue: DataType.NOW,
    })
    created_at: Date;
  
    @ForeignKey(() => User)
    @ApiProperty({
      description: 'Admin user ID who generated the report',
      example: '123e4567-e89b-12d3-a456-426614174000',
      format: 'uuid',
    })
    
    @Column({
      type: DataType.UUID,
      allowNull: false,
    })
    create_by: string;
  }
  