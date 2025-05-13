import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SECRETORKEY } from 'my-common-props'; // ESM 방식으로 가져오기
import { JwtPayload } from '../../domain/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${SECRETORKEY}`,
    });
  }

  validate(payload: JwtPayload) {
    if (!payload?.username) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return {
      username: payload.username,
    };
  }
}
