import { InjectRepository } from '@nestjs/typeorm';
import { CommonUseCase } from 'src/common/common.usecase';
import { Repository } from 'typeorm';
import { ResponseDto } from 'src/common/common.dto';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user.entity';
import { RedisService } from 'src/redis/redis.service';
import { FindAuthUseCase } from './find-auth.use-case';
import { dataToAuthArray, stringToJson } from '../util/use-util';
import { Auth } from '../../domain/auth.entity';

@Injectable()
export class FindUserByIdUseCase implements CommonUseCase<Request> {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly redisService: RedisService,
    private readonly findAuthUseCase: FindAuthUseCase,
  ) {}

  async execute(req: Request): Promise<ResponseDto> {
    if (req?.user && req?.user?.username) {
      const { result } = await this.findAuthUseCase.execute();
      const auths: Auth[] = dataToAuthArray(result);
      const username = req?.user?.username;
      let user = await this.redisService.get(`${username}_info`);
      if (!user) {
        const userInfo = await this.userRepo.findOne({
          where: {
            username,
          },
        });
        if (userInfo) {
          userInfo.authCodes = userInfo.auths
            .map((key: string) => {
              const auth = auths.find((auth) => auth.authcode === key);
              return auth;
            })
            .filter((auth) => auth !== undefined);
          await this.redisService.set(
            `${username}_info`,
            JSON.stringify(userInfo),
            60 * 60 * 24,
          );
        }
        user = await this.redisService.get(`${username}_info`);
      }
      const data = stringToJson(user);
      return new ResponseDto(
        { success: true, data: data },
        'success',
        '사용자 정보 조회 성공',
      );
    }
    return new ResponseDto(
      {
        success: false,
        accessToken: '',
        refreshToken: '',
      },
      'error',
      '정보가 없습니다.',
    );
  }
}
