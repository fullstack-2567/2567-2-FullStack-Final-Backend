import { Column, Model, Table, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({
  tableName: 'users',
})
export class User extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    allowNull: false,
  })
  name: string;

  @Column({
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.ENUM('male', 'female', 'other'),
    allowNull: true,
  })
  sex: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  birthdate: Date;

  @Column({
    defaultValue: 'user',
  })
  role: string;

  @Column({
    allowNull: true,
  })
  googleId: string;

  @Column({
    defaultValue: false,
  })
  disabled: boolean;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  refreshToken: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  hashedRefreshToken: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}