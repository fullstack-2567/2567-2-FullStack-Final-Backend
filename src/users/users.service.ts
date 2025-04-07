import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/entities/user.entity';
import { UserRole } from 'src/types/enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findOrCreateByGoogleId(googleProfile: any): Promise<User> {
    const { id, displayName, emails, photos } = googleProfile;
    
    // Find by googleId
    let user = await this.userModel.findOne({ where: { googleId: id } });
    
    if (!user) {
      // Check if user with this email exists (for merging accounts)
      user = await this.userModel.findOne({ where: { email: emails[0].value } });
      
      if (user) {
        // User exists but without googleId, update it
        user.googleId = id;
        user.picture = user.picture || photos?.[0]?.value;
        await user.save();
      } else {
        // Create new user with default USER role
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

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async updateRole(userId: string, role: UserRole): Promise<User> {
    const user = await this.findById(userId);
    user.role = role;
    await user.save();
    return user;
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    const user = await this.findById(userId);
    
    if (refreshToken) {
      user.refreshToken = refreshToken;
    } else {
      user.refreshToken = null;
    }
    
    await user.save();
  }
  
}