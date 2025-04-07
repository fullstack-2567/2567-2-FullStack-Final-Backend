import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async googleLogin(googleData: any) {
    try {
      let user = await this.usersService.findByEmail(googleData.email);

      
      if (!user) {
        // Create new user if doesn't exist
        user = await this.usersService.create({
          email: googleData.email,
          name: googleData.name,
          googleId: googleData.googleId,
        });
      } else if (user.disabled) {
        throw new UnauthorizedException('AUTH_USER_DISABLED');
      }

      // Generate tokens
      const tokens = await this.generateTokens(user);
      
      // Hash and save refresh token
      const hashedRefreshToken = await this.hashData(tokens.refresh_token);
      await this.usersService.updateRefreshToken(user.id, tokens.refresh_token, hashedRefreshToken);
      
      return {
        user_id: user.id,
        name: user.name,
        email: user.email,
        sex: user.sex,
        birthdate: user.birthdate,
        created_at: user.createdAt,
        ...tokens,
      };
    } catch (error) {
      if (error.message === 'AUTH_USER_DISABLED') {
        throw new UnauthorizedException('AUTH_USER_DISABLED');
      }
      throw new BadRequestException('AUTH_GOOGLE_FAILED');
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token signature
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersService.findByRefreshToken(refreshToken);
      
      if (!user || !user.hashedRefreshToken) {
        throw new UnauthorizedException('AUTH_REFRESH_INVALID');
      }

      if (user.disabled) {
        throw new UnauthorizedException('AUTH_USER_DISABLED');
      }

      // Verify that stored hashed token matches the provided token
      const refreshTokenMatches = await this.verifyRefreshToken(
        refreshToken,
        user.hashedRefreshToken,
      );

      if (!refreshTokenMatches) {
        throw new UnauthorizedException('AUTH_REFRESH_INVALID');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user);
      
      // Hash and update refresh token
      const hashedRefreshToken = await this.hashData(tokens.refresh_token);
      await this.usersService.updateRefreshToken(user.id, tokens.refresh_token, hashedRefreshToken);
      
      return tokens;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('AUTH_REFRESH_EXPIRED');
      }
      throw new UnauthorizedException('AUTH_REFRESH_INVALID');
    }
  }

  async logout(userId: string) {
    await this.usersService.removeRefreshToken(userId);
    return { message: 'Successfully logged out' };
  }

  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findById(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('AUTH_USER_NOT_FOUND');
      }

      if (user.disabled) {
        throw new UnauthorizedException('AUTH_USER_DISABLED');
      }

      const expiresIn = this.getTokenRemainingTime(token);
      
      return {
        valid: true,
        user_id: user.id,
        expires_in: expiresIn,
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('AUTH_TOKEN_EXPIRED');
      }
      throw new UnauthorizedException('AUTH_INVALID_TOKEN');
    }
  }

  async getCurrentUser(userId: string) {
    const user = await this.usersService.findById(userId);
    
    if (!user) {
      throw new UnauthorizedException('AUTH_USER_NOT_FOUND');
    }

    if (user.disabled) {
      throw new UnauthorizedException('AUTH_USER_DISABLED');
    }

    return {
      user_id: user.id,
      name: user.name,
      email: user.email,
      sex: user.sex,
      birthdate: user.birthdate,
      created_at: user.createdAt,
      role: user.role,
    };
  }

  private async generateTokens(user: any) {
    const payload = { email: user.email, sub: user.id };
    
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '1h',
    });
    
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '30d',
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 3600, // 1 hour in seconds
    };
  }

  private getTokenRemainingTime(token: string): number {
    const decoded = this.jwtService.decode(token) as { exp: number };
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
    return expiresIn > 0 ? expiresIn : 0;
  }

  // Argon2 methods for secure hashing
  private async hashData(data: string): Promise<string> {
    // Use Argon2 with secure settings
    return argon2.hash(data, {
      type: argon2.argon2id, // Use Argon2id variant (balances security and resistance)
      memoryCost: 2 ** 16,   // 64MB memory cost
      timeCost: 3,           // 3 iterations
      parallelism: 1,        // 1 degree of parallelism
    });
  }

  private async verifyRefreshToken(
    refreshToken: string,
    hashedRefreshToken: string,
  ): Promise<boolean> {
    try {
      return await argon2.verify(hashedRefreshToken, refreshToken);
    } catch (error) {
      return false;
    }
  }
}