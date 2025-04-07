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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { Public } from './decorators/public.decorator';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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
  
    return res.redirect('http://localhost/dashboard.php');
  }

  @Public()
  @Post('verify')
  async verifyToken(@Body() body: VerifyTokenDto) {
    try {
      const decoded = this.jwtService.verify(body.access_token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });

      const nowInSec = Math.floor(Date.now() / 1000);
      const expiresIn = decoded.exp - nowInSec;

      return {
        status: 'success',
        data: {
          valid: true,
          user_id: decoded.sub,
          expires_in: expiresIn > 0 ? expiresIn : 0,
        },
      };
    } catch (err) {
      return {
        status: 'success',
        data: {
          valid: false,
          user_id: null,
          expires_in: 0,
        },
      };
    }
  }
  
}