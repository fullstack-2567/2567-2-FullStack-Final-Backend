import {
  Model,
  Column,
  DataType,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Table({
  tableName: 'Project',
  timestamps: false,
})
export class Project extends Model {
  @ApiProperty({
    description: 'Unique identifier of the project',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  projectId: string;

  @ApiProperty({
    description: 'ID of the user who submitted the project',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  submittedByUserId: string;

  @ApiProperty({
    type: () => User,
    description: 'User who submitted the project',
  })
  @BelongsTo(() => User, 'SubmittedByUserID')
  submittedByUser: User;

  @ApiProperty({
    description: 'Thai name of the project',
    example: 'โครงการพัฒนาระบบจัดการข้อมูล',
    minLength: 1,
    maxLength: 255,
  })
  @Column({ type: DataType.STRING, allowNull: false })
  projectThaiName: string;

  @ApiProperty({
    description: 'English name of the project',
    example: 'Data Management System Development Project',
    minLength: 1,
    maxLength: 255,
  })
  @Column({ type: DataType.STRING, allowNull: false })
  projectEngName: string;

  @ApiProperty({
    description: 'Summary of the project',
    example: 'A comprehensive data management system development project',
    minLength: 1,
    maxLength: 1000,
  })
  @Column({ type: DataType.STRING, allowNull: false })
  projectSummary: string;

  @ApiProperty({
    description: 'Start date of the project',
    example: '2024-01-01',
    format: 'date',
  })
  @Column({ type: DataType.DATEONLY, allowNull: false })
  startDate: Date;

  @ApiProperty({
    description: 'End date of the project',
    example: '2024-12-31',
    format: 'date',
  })
  @Column({ type: DataType.DATEONLY, allowNull: false })
  endDate: Date;

  @ApiProperty({
    description: 'SDG type of the project',
    enum: [
      'SDG1',
      'SDG2',
      'SDG3',
      'SDG4',
      'SDG5',
      'SDG6',
      'SDG7',
      'SDG8',
      'SDG9',
      'SDG10',
      'SDG11',
      'SDG12',
      'SDG13',
      'SDG14',
      'SDG15',
      'SDG16',
      'SDG17',
    ],
    example: 'SDG9',
  })
  @Column({
    type: DataType.ENUM(
      'SDG1',
      'SDG2',
      'SDG3',
      'SDG4',
      'SDG5',
      'SDG6',
      'SDG7',
      'SDG8',
      'SDG9',
      'SDG10',
      'SDG11',
      'SDG12',
      'SDG13',
      'SDG14',
      'SDG15',
      'SDG16',
      'SDG17',
    ),
    allowNull: false,
  })
  sdgType:
    | 'SDG1'
    | 'SDG2'
    | 'SDG3'
    | 'SDG4'
    | 'SDG5'
    | 'SDG6'
    | 'SDG7'
    | 'SDG8'
    | 'SDG9'
    | 'SDG10'
    | 'SDG11'
    | 'SDG12'
    | 'SDG13'
    | 'SDG14'
    | 'SDG15'
    | 'SDG16'
    | 'SDG17';

  @ApiProperty({ description: 'Project description file path' })
  @Column({ type: DataType.STRING, allowNull: false })
  projectDescriptionFile: string;

  @ApiProperty({
    description: 'Type of the project',
    enum: [
      'energy_and_environment',
      'construction_and_infrastructure',
      'agriculture_and_food',
      'materials_and_minerals',
      'finance_and_investment',
      'technology_and_innovation',
      'medicine_and_health',
      'human_resource_development',
      'manufacturing_and_automotive',
      'electronics_and_retail',
      'real_estate_and_urban_development',
      'media_and_entertainment',
      'tourism_and_services',
      'society_and_community',
    ],
    example: 'technology_and_innovation',
  })
  @Column({
    type: DataType.ENUM(
      'energy_and_environment',
      'construction_and_infrastructure',
      'agriculture_and_food',
      'materials_and_minerals',
      'finance_and_investment',
      'technology_and_innovation',
      'medicine_and_health',
      'human_resource_development',
      'manufacturing_and_automotive',
      'electronics_and_retail',
      'real_estate_and_urban_development',
      'media_and_entertainment',
      'tourism_and_services',
      'society_and_community',
    ),
    allowNull: false,
  })
  projectType:
    | 'energy_and_environment'
    | 'construction_and_infrastructure'
    | 'agriculture_and_food'
    | 'materials_and_minerals'
    | 'finance_and_investment'
    | 'technology_and_innovation'
    | 'medicine_and_health'
    | 'human_resource_development'
    | 'manufacturing_and_automotive'
    | 'electronics_and_retail'
    | 'real_estate_and_urban_development'
    | 'media_and_entertainment'
    | 'tourism_and_services'
    | 'society_and_community';

  @ApiProperty({
    description: 'ID of the parent project',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  parentProjectID: string;

  @ApiProperty({
    type: () => Project,
    description: 'Parent project details',
    required: false,
  })
  @BelongsTo(() => Project, 'ParentProjectID')
  parentProject: Project;

  @ApiProperty({
    type: () => [Project],
    description: 'Child projects',
    required: false,
  })
  @HasMany(() => Project, 'ParentProjectID')
  childProjects: Project[];

  @ApiProperty({
    description: 'First approval date',
    required: false,
    example: '2024-01-15T10:30:00Z',
    format: 'date-time',
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  firstApprovedDT: Date;

  @ApiProperty({
    description: 'ID of the user who first approved',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  firstApprovedByUserId: string;

  @ApiProperty({
    type: () => User,
    description: 'User who first approved the project',
    required: false,
  })
  @BelongsTo(() => User, 'FirstApprovedByUserID')
  firstApprovedByUser: User;

  @ApiProperty({
    description: 'Second approval date',
    required: false,
    example: '2024-01-20T14:45:00Z',
    format: 'date-time',
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  secondApprovedDT: Date;

  @ApiProperty({
    description: 'ID of the user who second approved',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  secondApprovedByUserId: string;

  @ApiProperty({
    type: () => User,
    description: 'User who second approved the project',
    required: false,
  })
  @BelongsTo(() => User, 'SecondApprovedByUserID')
  secondApprovedByUser: User;

  @ApiProperty({
    description: 'Third approval date',
    required: false,
    example: '2024-01-25T09:15:00Z',
    format: 'date-time',
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  thirdApprovedDT: Date;

  @ApiProperty({
    description: 'ID of the user who third approved',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  thirdApprovedByUserId: string;

  @ApiProperty({
    type: () => User,
    description: 'User who third approved the project',
    required: false,
  })
  @BelongsTo(() => User, 'ThirdApprovedByUserID')
  thirdApprovedByUser: User;
}
