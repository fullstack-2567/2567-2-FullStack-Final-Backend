import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super(<StrategyOptionsWithRequest>{
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          // const authHeader = req.headers['authorization'];
          // if (!authHeader) return null;
          // const [type, token] = authHeader.split(' ');
          // return type === 'Bearer' ? token : null;
          const refreshToken = req.cookies['refresh_token'];
          if (!refreshToken) return null;
          return refreshToken;
        },
      ]),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: { sub: string; email: string; role: string },
  ) {
    // const refreshToken = req.headers['authorization']?.split(' ')[1];
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      refreshToken,
    };
  }
}
