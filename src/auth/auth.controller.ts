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
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { Public } from './decorators/public.decorator';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { VerifyTokenResponse } from './interfaces/verify-token-response.interface';
import { AuthErrorCode } from './constants/auth-error-code.enum';
import { AuthGuard } from '@nestjs/passport';

import {
  ApiTags,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { LogsService } from 'src/logs/logs.service';
import { User } from 'src/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private authService: AuthService,
    private logsService: LogsService,
  ) {}

  @Get('test')
  @ApiOperation({ summary: 'Test endpoint' })
  @ApiResponse({ status: 200, description: 'Test successful' })
  test() {
    return { message: 'Test successful' };
  }

  // me endpoint to get user info
  @ApiOperation({ summary: 'Get current user info' })
  @ApiCookieAuth('access_token')
  @ApiResponse({ status: 200, description: 'User info returned' })
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async me(@Req() req: Request) {
    const user = req.user as { userId: string };
    const userInfo = await this.authService.getUserInfo(user.userId);
    return { status: 'success', data: userInfo };
  }

  @ApiOperation({ summary: 'Logout current user' })
  @ApiCookieAuth('access_token')
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });

    return res.json({
      status: 'success',
      message: 'Logged out successfully',
    });
  }

  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiCookieAuth('refresh_token')
  @ApiResponse({ status: 200, description: 'New tokens returned' })
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Req() req: Request) {
    const user = req.user as { sub: string; refreshToken: string };
    return this.authService.refreshTokens(user.sub, user.refreshToken);
  }

  @Public()
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  @ApiResponse({ status: 302, description: 'Redirect to Google login page' })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Public()
  @ApiOperation({ summary: 'Handle Google OAuth callback' })
  @ApiResponse({
    status: 302,
    description: 'Redirects back to frontend with cookie',
  })
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    const tokens = await this.authService.handleGoogleLogin(user);

    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    await this.logsService.login(user.userId);

    return res.redirect(`${this.configService.get('FRONTEND_URL')}`);
  }

  @Public()
  @ApiOperation({ summary: 'Verify access token validity' })
  @ApiBody({ type: VerifyTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Returns token validity, user ID, and expiry',
  })
  @Post('verify')
  async verifyToken(
    @Body() body: VerifyTokenDto,
  ): Promise<VerifyTokenResponse> {
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
      if (err?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException({
          status: 'error',
          message: 'Invalid token',
          code: AuthErrorCode.AUTH_INVALID_TOKEN,
        });
      }

      if (err?.name === 'TokenExpiredError') {
        throw new UnauthorizedException({
          status: 'error',
          message: 'Token has expired',
          code: AuthErrorCode.AUTH_TOKEN_EXPIRED,
        });
      }

      throw new UnauthorizedException({
        status: 'error',
        message: 'Authentication failed',
        code: AuthErrorCode.AUTH_INVALID_TOKEN,
      });
    }
  }
}
