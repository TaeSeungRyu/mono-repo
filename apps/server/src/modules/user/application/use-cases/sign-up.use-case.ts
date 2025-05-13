import { InjectRepository } from '@nestjs/typeorm';
import { CommonUseCase } from 'src/common/common.usecase';
import { Repository } from 'typeorm';
import { ResponseDto } from 'src/common/common.dto';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user.entity';

@Injectable()
export class SignUpUseCase implements CommonUseCase<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async execute(body: User): Promise<ResponseDto> {
    const { username, password, name } = body;
    const user = await this.userRepo.findOne({
      where: {
        username,
      },
    });
    if (user) {
      return new ResponseDto(
        { success: false },
        'error',
        '이미 존재하는 사용자입니다.',
      );
    } else {
      const newUser = this.userRepo.create({
        username,
        password,
        name,
      });
      await this.userRepo.save(newUser);
      return new ResponseDto({ success: true }, 'success', '사용자 등록 성공');
    }
  }
}
