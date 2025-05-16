import { InjectRepository } from '@nestjs/typeorm';
import { CommonUseCase } from 'src/common/common.usecase';
import { Repository } from 'typeorm';
import { ResponseDto } from 'src/common/common.dto';

import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user.entity';
import { UserDto } from '../../domain/user.dto';

@Injectable()
export class DeleteUserInfoUseCase implements CommonUseCase<UserDto> {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async execute(body: UserDto): Promise<ResponseDto> {
    const user = await this.userRepo.findOne({
      where: {
        id: body.id,
        password: body.oldPassword,
      },
    });

    if (user && body.id) {
      await this.userRepo.delete(body.id);
      return new ResponseDto(
        { success: true },
        'success',
        '사용자 정보 삭제 성공',
      );
    } else {
      return new ResponseDto(
        { success: false },
        'error',
        '사용자 정보 삭제 실패',
      );
    }
  }
}
