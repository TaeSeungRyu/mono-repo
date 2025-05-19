import { InjectRepository } from '@nestjs/typeorm';
import { CommonUseCase } from 'src/common/common.usecase';
import { Repository } from 'typeorm';
import { ResponseDto } from 'src/common/common.dto';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user.entity';
import { FindAuthUseCase } from './find-auth.use-case';
import { dataToAuthArray } from '../util/use-util';
import { Auth } from '../../domain/auth.entity';

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
    private readonly findAuthUseCase: FindAuthUseCase,
  ) {}

  async execute({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<ResponseDto> {
    const { result } = await this.findAuthUseCase.execute();
    const auths: Auth[] = dataToAuthArray(result);
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
        auths: true,
      },
    });

    if (data && data.auths) {
      data.authCodes = data.auths
        .map((key: string) => {
          const auth = auths.find((auth) => auth.authcode === key);
          return auth;
        })
        .filter((auth) => auth !== undefined);
    }
    return new ResponseDto(
      { success: true, data: data },
      'success',
      '조회 성공',
    );
  }
}
