import { CommonUseCase } from 'src/common/common.usecase';

import { ResponseDto } from 'src/common/common.dto';

import { Request, Response } from 'express';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/application/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/user/domain/user.entity';
import { JWTCode } from '../../domain/jwt-payload.interface';
import { RedisService } from 'src/redis/redis.service';
import { Auth } from 'src/modules/user/domain/auth.entity';

@Injectable()
export class ValidateUserUseCase
  implements
    CommonUseCase<{ username: string; password: string; res: Response }>
{
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async execute({
    username,
    password,
    res,
  }: {
    username: string;
    password: string;
    res: Response;
  }): Promise<ResponseDto> {
    const user = await this.userService.findUserByIdPassword(
      username,
      password,
    );

    if (!user?.result?.data) {
      return new Promise((resolve) => {
        resolve(
          new ResponseDto(
            {
              accessToken: '',
              refreshToken: '',
              success: false,
            },
            'invalid_credentials',
            '아이디 또는 비밀번호가 틀립니다.',
          ),
        );
      });
    }

    const roles: Auth[] = [];
    if (user.result?.data instanceof User) {
      if (user.result?.data.authCodes) {
        roles.push(...user.result.data.authCodes);
      }
    }
    if (roles.length === 0) {
      return new Promise((resolve) => {
        resolve(
          new ResponseDto(
            {
              accessToken: '',
              refreshToken: '',
              success: false,
            },
            'invalid_credentials',
            '권한이 있어야 로그인 가능합니다.',
          ),
        );
      });
    }
    const accessToken = this.jwtService.sign({ username, roles });
    const refreshToken = this.jwtService.sign(
      { username, roles },
      { expiresIn: '1d' },
    );

    if (user.result?.data instanceof User) {
      this.setCookieAndRedisCache(res, user.result?.data, refreshToken);
    }

    return new Promise((resolve) => {
      resolve(
        new ResponseDto(
          {
            accessToken: accessToken,
            refreshToken: refreshToken,
            success: true,
          },
          '',
          'Login successful',
        ),
      );
    });
  }
  /**
   *
   * @param res 응답 객체(쿠키 설정)
   * @param username 사용자 아이디
   * @param refreshToken refreshToken
   * @description 쿠키에 refreshToken을 설정하고 Redis에 캐시합니다.
   */
  private setCookieAndRedisCache(
    res: Response,
    user: User,
    refreshToken: string,
  ): void {
    res.cookie(JWTCode.refreshToken, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    this.redisService
      .exists(user.username)
      .then(async (exists) => {
        if (exists) {
          await this.redisService.del(user.username);
          await this.redisService.del(`${user.username}_info`);
        }
        await this.redisService.set(user.username, refreshToken, 60 * 60 * 1); // 1시간
        await this.redisService.set(
          `${user.username}_info`,
          JSON.stringify(user),
          60 * 60 * 24,
        ); // 24시간
      })
      .catch((error) => {
        console.error('Redis error:', error);
        // Redis 오류 처리 로직 추가 (예: 로그 기록, 알림 등)
      });
  }
}
