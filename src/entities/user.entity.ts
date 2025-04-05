import { Model, Column, DataType, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table({
  tableName: 'User',
  timestamps: false,
})
export class User extends Model {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  userId: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
    format: 'email',
  })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @ApiProperty({
    description: 'Date when the user was created',
    example: '2024-01-01T00:00:00Z',
    format: 'date-time',
  })
  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdDT: Date;

  @ApiProperty({
    description: 'Date when the user was last updated',
    example: '2024-01-01T00:00:00Z',
    format: 'date-time',
  })
  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAT: Date;

  @ApiProperty({
    description: 'Role of the user',
    enum: ['admin', 'user', 'project-approver'],
    default: 'user',
    example: 'user',
  })
  @Column({
    type: DataType.ENUM('admin', 'user', 'project-approver'),
    defaultValue: 'user',
  })
  role: 'admin' | 'user' | 'project-approver';

  @ApiProperty({
    description: 'Gender of the user',
    enum: ['male', 'female', 'other'],
    example: 'male',
  })
  @Column({ type: DataType.ENUM('male', 'female', 'other') })
  sex: 'male' | 'female' | 'other';

  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
    minLength: 1,
    maxLength: 100,
  })
  @Column({ type: DataType.STRING })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
    minLength: 1,
    maxLength: 100,
  })
  @Column({ type: DataType.STRING })
  lastName: string;

  @ApiProperty({
    description: 'Birth date of the user',
    example: '1990-01-01',
    format: 'date',
  })
  @Column({ type: DataType.DATEONLY })
  birthDate: Date;

  @ApiProperty({
    description: 'Title prefix of the user',
    enum: ['master', 'miss', 'mr', 'mrs', 'ms'],
    example: 'mr',
  })
  @Column({
    type: DataType.ENUM('master', 'miss', 'mr', 'mrs', 'ms'),
  })
  prefix: 'master' | 'miss' | 'mr' | 'mrs' | 'ms';

  @ApiProperty({
    description: 'Education level of the user',
    enum: [
      'elementary',
      'secondary',
      'bachelor',
      'master',
      'doctoral',
      'vocational_certificate',
      'high_vocational_certificate',
    ],
    example: 'bachelor',
  })
  @Column({
    type: DataType.ENUM(
      'elementary',
      'secondary',
      'bachelor',
      'master',
      'doctoral',
      'vocational_certificate',
      'high_vocational_certificate',
    ),
  })
  education:
    | 'elementary'
    | 'secondary'
    | 'bachelor'
    | 'master'
    | 'doctoral'
    | 'vocational_certificate'
    | 'high_vocational_certificate';

  @ApiProperty({
    description: 'Telephone number of the user',
    example: '0812345678',
    pattern: '^[0-9]{10}$',
  })
  @Column({
    type: DataType.STRING,
  })
  tel: string;
}
