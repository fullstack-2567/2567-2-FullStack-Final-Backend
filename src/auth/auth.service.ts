import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { AuthErrorCode } from './constants/auth-error-code.enum';
import { User } from 'src/entities/user.entity';

export interface TokensDto {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(profile: any) {
    return this.usersService.findOrCreateByGoogleId(profile);
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<TokensDto> {
    const user = await this.usersService.findById(userId);
  
    if (!user || !user.refreshToken) {
      throw new ForbiddenException({
        status: 'error',
        message: 'User not found or no refresh token',
        code: AuthErrorCode.AUTH_REFRESH_INVALID,
      });
    }
  
    // ตรวจ refresh token ว่าตรงกับใน DB
    if (user.refreshToken !== refreshToken) {
      throw new ForbiddenException({
        status: 'error',
        message: 'Invalid refresh token',
        code: AuthErrorCode.AUTH_REFRESH_INVALID,
      });
    }
  
    const tokens = await this.generateTokens(user.userId, user.email, user.role);
  
    // เก็บ refresh token ใหม่ (rotation)
    await this.usersService.updateRefreshToken(user.userId, tokens.refreshToken);
  
    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
  }

  async generateTokens(userId: string, email: string, role: string): Promise<TokensDto> {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '7d'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async handleGoogleLogin(user: User): Promise<TokensDto> {
    const tokens = await this.generateTokens(user.userId, user.email, user.role);
    await this.usersService.updateRefreshToken(user.userId, tokens.refreshToken);
    return tokens;
  }

  async getUserInfo(userId: string): Promise<User> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new ForbiddenException({
        status: 'error',
        message: 'User not found',
        code: AuthErrorCode.AUTH_USER_NOT_FOUND,
      });
    }
    return user;
  }
}
