import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/entities/user.entity';
import { UserRole } from 'src/types/user.enum';
import { patchUserByIdDto } from './dto/patchUserById.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  // สำหรับ Google OAuth
  async findOrCreateByGoogleId(googleProfile: any): Promise<User> {
    const { id, displayName, emails, photos } = googleProfile;

    let user = await this.userModel.findOne({ where: { googleId: id } });

    if (!user) {
      user = await this.userModel.findOne({ where: { email: emails[0].value } });

      if (user) {
        user.googleId = id;
        user.picture = user.picture || photos?.[0]?.value;
        await user.save();
      } else {
        user = await this.userModel.create({
          googleId: id,
          email: emails[0].value,
          name: displayName,
          picture: photos?.[0]?.value,
          role: 'user',
        });
      }
    }

    return user;
  }

  // ดึงข้อมูลผู้ใช้ตาม ID
  async findById(id: string): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // ดึงผู้ใช้ทั้งหมด
  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  // อัปเดต Role ผู้ใช้ (เฉพาะ Admin)
  async updateRole(userId: string, role: UserRole): Promise<User> {
    const user = await this.findById(userId);
    user.role = role;
    await user.save();
    return user;
  }

  // อัปเดต Refresh Token (สำหรับ Auth)
  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    const user = await this.findById(userId);
    user.refreshToken = refreshToken || null;
    await user.save();
  }

  // อัปเดตข้อมูลผู้ใช้ทั่วไป
  async updateUserById(userId: string, updateData: patchUserByIdDto): Promise<User> {
    const user = await this.findById(userId);

    const { birthDate, ...otherFields } = updateData;

    if (birthDate) {
      user.birthDate = new Date(birthDate);
    }

    Object.assign(user, otherFields);

    await user.save();
    return user;
  }

  async findAllWithPagination(page = 1, limit = 10): Promise<{
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
  
    const { rows: users, count: total } = await this.userModel.findAndCountAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });
  
    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
  
}
