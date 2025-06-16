import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { SECRETORKEY } from 'my-common-props'; // ESM 방식으로 가져오기
import { UserModule } from 'src/modules/user/user.module';
import { AuthController } from './infrastructure/auth.controller';
import { AuthService } from './application/services/auth.service';
import { JwtStrategy } from './application/services/jwt.strategy';
import { LogOutUseCase } from './application/use-cases/log-out.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { ValidateUserUseCase } from './application/use-cases/validate-user.use-case';
import { RedisProviderModule } from 'src/redis/redis.module';
import { SseModule } from '../sse/sse.module';
import { AuthMobileController } from './infrastructure/auth.mobile.controller';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: `${SECRETORKEY}`,
      //signOptions: { expiresIn: '1m' },
      signOptions: { expiresIn: '1h' },
    }),
    RedisProviderModule,
    SseModule,
  ],
  controllers: [AuthController, AuthMobileController],
  providers: [
    AuthService,
    JwtStrategy,
    LogOutUseCase,
    RefreshTokenUseCase,
    ValidateUserUseCase,
  ],
  exports: [JwtModule],
})
export class AuthModule {}
