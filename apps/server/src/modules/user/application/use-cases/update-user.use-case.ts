import { InjectRepository } from '@nestjs/typeorm';
import { CommonUseCase } from 'src/common/common.usecase';
import { Repository } from 'typeorm';
import { ResponseDto } from 'src/common/common.dto';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user.entity';
import { RedisService } from 'src/redis/redis.service';
import { UserDto } from '../../domain/user.dto';

@Injectable()
export class UpdateUserInfoUseCase implements CommonUseCase<UserDto> {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly redisService: RedisService,
  ) {}

  async execute(body: UserDto): Promise<ResponseDto> {
    const user = await this.userRepo.findOne({
      where: {
        id: body.id,
        password: body.oldPassword,
      },
    });
    if (user && body.id) {
      const { id, name, auths } = body;

      // null 또는 undefined가 아닌 값만 필터링
      // TODO : DTO를 엔티티로 변환하는 기능이 필요함!!!!!
      const updateData = {
        name,
      };
      if (body.newPassword) {
        updateData['password'] = body.newPassword;
      }
      if (body.auths) {
        updateData['auths'] = [auths];
      } else {
        updateData['auths'] = [];
      }

      await this.userRepo.update(id, updateData);
      await this.redisService.set(
        `${user.username}_info`,
        JSON.stringify({
          ...user,
          ...updateData,
        }),
      );
      return new ResponseDto(
        { success: true },
        'success',
        '사용자 정보 수정 성공',
      );
    } else {
      return new ResponseDto(
        { success: false },
        'error',
        '사용자 정보 수정 실패',
      );
    }
  }
}
