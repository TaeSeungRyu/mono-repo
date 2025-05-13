import { InjectRepository } from '@nestjs/typeorm';
import { CommonUseCase } from 'src/common/common.usecase';
import { Repository } from 'typeorm';
import { ResponseDto } from 'src/common/common.dto';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user.entity';

@Injectable()
export class FindUserByIdPasswordUseCase
  implements
    CommonUseCase<{
      username: string;
      password: string;
    }>
{
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async execute({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<ResponseDto> {
    const data = await this.userRepo.findOne({
      where: {
        username,
        password,
      },
      select: {
        username: true,
        name: true,
        lastlogin: true,
        id: true,
      },
    });
    return new ResponseDto(
      { success: true, data: data },
      'success',
      '조회 성공',
    );
  }
}
