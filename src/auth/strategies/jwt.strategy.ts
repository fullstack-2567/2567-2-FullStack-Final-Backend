import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const accessToken = req.cookies['access_token'];

          if (!accessToken && process.env.NODE_ENV === 'development') {
            const authHeader = req.headers['authorization'];
            if (!authHeader) return null;
            const [type, token] = authHeader.split(' ');
            return type === 'Bearer' ? token : null;
          }

          if (!accessToken) return null;
          return accessToken;
        },
      ]),
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET')!,
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    const user = await this.usersService.findById(payload.sub);
    return user;
  }
}
