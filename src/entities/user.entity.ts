import { Model, Column, DataType, Table } from 'sequelize-typescript';

@Table({
  tableName: 'User',
  timestamps: false,
})
export class Users extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  UserID: string;

  @Column({ type: DataType.STRING })
  FName: string;

  @Column({ type: DataType.STRING })
  LName: string;

  @Column({ type: DataType.DATE })
  BirthDate: Date;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  Email: string;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  CreatedDT: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  UpdatedDT: Date;

  @Column({ type: DataType.ENUM('male', 'female', 'other') })
  Sex: 'male' | 'female' | 'other';

  @Column({
    type: DataType.ENUM('admin', 'user', 'project-approver'),
    defaultValue: 'user',
  })
  Role: 'admin' | 'user' | 'project-approver';
}
