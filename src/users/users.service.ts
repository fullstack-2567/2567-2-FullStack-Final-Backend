import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByRefreshToken(refreshToken: string): Promise<User> {
    const user = await this.userModel.findOne({ where: { refreshToken } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(userData: Partial<User>): Promise<User> {
    return this.userModel.create(userData);
  }

  async updateRefreshToken(userId: string, refreshToken: string, hashedRefreshToken: string): Promise<void> {
    await this.userModel.update(
      { 
        refreshToken,
        hashedRefreshToken 
      }, 
      { where: { id: userId } }
    );
  }

  async removeRefreshToken(userId: string): Promise<void> {
    await this.userModel.update(
      { 
        refreshToken: null,
        hashedRefreshToken: null 
      }, 
      { where: { id: userId } }
    );
  }
}