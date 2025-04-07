import { 
  Controller, 
  Get, 
  Post, 
  Req, 
  Res,
  UseGuards,
  HttpStatus,
  HttpCode,
  Body,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { Public } from './decorators/public.decorator';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { VerifyTokenResponse } from './interfaces/verify-token-response.interface';
import { AuthErrorCode } from './constants/auth-error-code.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private authService: AuthService
  ) {}

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    const user = req.user as { id: string };
    await this.authService.logout(user.id);
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Req() req: Request) {
    const user = req.user as { sub: string; refreshToken: string };
    return this.authService.refreshTokens(user.sub, user.refreshToken);
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const tokens = await this.authService.handleGoogleLogin(req.user as any);

    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });
  
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  
    return res.redirect(`${this.configService.get('FRONTEND_URL')}`);
  }

  @Public()
  @Post('verify')
  async verifyToken(@Body() body: VerifyTokenDto): Promise<VerifyTokenResponse> {
    try {
      const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
      if (!secret) {
        throw new BadRequestException({
          status: 'error',
          message: 'Missing JWT secret',
          code: AuthErrorCode.AUTH_INVALID_TOKEN,
        });
      }

      const decoded = this.jwtService.verify<{
        sub: string;
        exp: number;
      }>(body.access_token, { secret });

      const now = Math.floor(Date.now() / 1000);
      const expiresIn = Math.max(decoded.exp - now, 0);

      if (expiresIn <= 0) {
        throw new UnauthorizedException({
          status: 'error',
          message: 'Token has expired',
          code: AuthErrorCode.AUTH_TOKEN_EXPIRED,
        });
      }

      return {
        status: 'success',
        data: {
          valid: true,
          user_id: decoded.sub,
          expires_in: expiresIn,
        },
      };
    } catch (err: any) {
      // Token malformed / invalid
      if (err?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException({
          status: 'error',
          message: 'Invalid token',
          code: AuthErrorCode.AUTH_INVALID_TOKEN,
        });
      }

      // Token expired
      if (err?.name === 'TokenExpiredError') {
        throw new UnauthorizedException({
          status: 'error',
          message: 'Token has expired',
          code: AuthErrorCode.AUTH_TOKEN_EXPIRED,
        });
      }

      // Default fallback
      throw new UnauthorizedException({
        status: 'error',
        message: 'Authentication failed',
        code: AuthErrorCode.AUTH_INVALID_TOKEN,
      });
    }
  }
  
}