import { InjectRepository } from '@nestjs/typeorm';
import { CommonUseCase } from 'src/common/common.usecase';
import { Repository } from 'typeorm';
import { ResponseDto } from 'src/common/common.dto';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user.entity';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UpdateUserInfoUseCase implements CommonUseCase<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly redisService: RedisService,
  ) {}

  async execute(body: User): Promise<ResponseDto> {
    const user = await this.userRepo.findOne({
      where: {
        id: body.id,
      },
    });
    if (user) {
      const { id, ...rest } = body;
      // null 또는 undefined가 아닌 값만 필터링
      const updateData = Object.fromEntries(
        Object.entries(rest).filter(
          ([, value]) => value !== null && value !== undefined,
        ),
      );
      delete updateData['username'];
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
