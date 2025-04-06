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
import {
  ProjectType,
  projectTypesArray,
  SDGType,
  sdgTypesArray,
} from 'src/types/enums';

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
  @BelongsTo(() => User, 'submittedByUserId')
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
    enum: sdgTypesArray,
    example: 'SDG9',
  })
  @Column({
    type: DataType.ENUM(...sdgTypesArray),
    allowNull: false,
  })
  sdgType: SDGType;

  @ApiProperty({ description: 'Project description file path' })
  @Column({ type: DataType.STRING, allowNull: false })
  projectDescriptionFile: string;

  @ApiProperty({
    description: 'Type of the project',
    enum: projectTypesArray,
    example: 'technology_and_innovation',
  })
  @Column({
    type: DataType.ENUM(...projectTypesArray),
    allowNull: false,
  })
  projectType: ProjectType;

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
  @BelongsTo(() => Project, { 
    foreignKey: 'parentProjectID', // ตรงนี้ต้องตรงกับชื่อคอลัมน์จริง (case-sensitive)
    as: 'ParentProject' // ตั้งชื่อ alias สำหรับ association นี้
  })
  parentProject: Project;

  @ApiProperty({
    type: () => [Project],
    description: 'Child projects',
    required: false,
  })
  @HasMany(() => Project, { 
    foreignKey: 'parentProjectID', 
    as: 'ChildProjects' 
  })
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
  @BelongsTo(() => User, 'firstApprovedByUserId')
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
  @BelongsTo(() => User, 'secondApprovedByUserId')
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
  @BelongsTo(() => User, 'thirdApprovedByUserId')
  thirdApprovedByUser: User;

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
  rejectedDT: Date;

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
  rejectedByUserId: string;

  @ApiProperty({
    type: () => User,
    description: 'User who third approved the project',
    required: false,
  })
  @BelongsTo(() => User, 'rejectedByUserId')
  rejectedByUser: User;
}
