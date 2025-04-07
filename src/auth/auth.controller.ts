import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RequestWithUser } from './interfaces/request-with-user.interface';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Get('test')
  test() {
    return {
      status: 'success',
      message: 'Auth controller is working!',
    };
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Initiates the Google authentication process
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userData = await this.authService.googleLogin(req.user);

    res.cookie('access_token', userData.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: this.configService.get('JWT_EXPIRES_IN') || 1000 * 60 * 60 * 24,
    });

    res.cookie('refresh_token', userData.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: this.configService.get('JWT_REFRESH_EXPIRES_IN') || 1000 * 60 * 60 * 24 * 30,
    });

    res.redirect(`${this.configService.get('FRONTEND_GOOGLE_REDIRECT_URL')}`);
  }

  @Post('refresh')
  async refreshToken(@Body() body: { refresh_token: string }) {
    return {
      status: 'success',
      data: await this.authService.refreshToken(body.refresh_token),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: RequestWithUser) {
    return {
      status: 'success',
      data: await this.authService.logout(req.user.userId),
    };
  }

  @Post('verify')
  async verifyToken(@Body() body: { access_token: string }) {
    return {
      status: 'success',
      data: await this.authService.verifyToken(body.access_token),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Req() req: RequestWithUser) {
    return {
      status: 'success',
      data: await this.authService.getCurrentUser(req.user.userId),
    };
  }
}
