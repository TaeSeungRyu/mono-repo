import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { SECRETORKEY } from 'my-common-props'; // ESM 방식으로 가져오기
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: `${SECRETORKEY}`,
      signOptions: { expiresIn: '1m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RedisService],
})
export class AuthModule {}
