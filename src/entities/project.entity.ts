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

@Table({
  tableName: 'Project',
  timestamps: false,
})
export class Project extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  ProjectID: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  SubmittedByUserID: string;

  @BelongsTo(() => User)
  SubmittedByUser: User;

  @Column({ type: DataType.STRING, allowNull: false })
  ProjectThaiName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  ProjectEngName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  ProjectSummary: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  StartDate: Date;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  EndDate: Date;

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
  SDGType:
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

  @Column({ type: DataType.STRING, allowNull: false })
  ProjectDescriptionFile: string;

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
  ProjectType:
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

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  ParentProjectID: string;

  @BelongsTo(() => Project, 'ParentProjectID')
  ParentProject: Project;

  @HasMany(() => Project, 'ParentProjectID')
  ChildProjects: Project[];
}
