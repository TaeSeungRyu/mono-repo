import { Module } from '@nestjs/common';

import { User } from './domain/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisService } from 'src/redis/redis.service';
import { UserService } from './application/service/user.service';
import { FindUserByIdPasswordUseCase } from './application/use-cases/find-id-password.use-case';
import { FindUserByIdUseCase } from './application/use-cases/find-id.use-case';
import { SignUpUseCase } from './application/use-cases/sign-up.use-case';
import { UpdateUserInfoUseCase } from './application/use-cases/update-user.use-case';
import { UserController } from './infrastructure/user.controller';
import { FindUserWithPagingUseCase } from './application/use-cases/find-paging.use-case';
import { DeleteUserInfoUseCase } from './application/use-cases/delete-user.use-case';
import { Auth } from './domain/auth.entity';
import { FindAuthUseCase } from './application/use-cases/find-auth.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([User, Auth])],
  providers: [
    RedisService,
    UserService,
    FindAuthUseCase,
    FindUserByIdPasswordUseCase,
    FindUserByIdUseCase,
    SignUpUseCase,
    UpdateUserInfoUseCase,
    FindUserWithPagingUseCase,
    DeleteUserInfoUseCase,
  ],
  controllers: [UserController],
  exports: [UserService], // UserService 다른 모듈에서 UserService를 사용할 수 있도록 export
})
export class UserModule {}
