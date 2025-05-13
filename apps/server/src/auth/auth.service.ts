import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { ResponseDto } from 'src/common/common.dto';

import { JWTCode, JwtPayload } from './jwt-payload.interface';
import { RedisService } from 'src/redis/redis.service';
import { UserService } from 'src/modules/user/application/service/user.service';
import { User } from 'src/modules/user/domain/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private redisService: RedisService,
  ) {}

  /**
   *
   * @param username 사용자 아이디
   * @param password 사용자 비밀번호
   * @param res 응답 객체(쿠키 설정)
   * @returns 로그인 성공시 accessToken과 refreshToken을 포함한 ResponseDto를 반환합니다.
   * @returns 로그인 실패시 accessToken과 refreshToken이 빈 문자열인 ResponseDto를 반환합니다.
   */
  async validateUser(
    username: string,
    password: string,
    res: Response,
  ): Promise<ResponseDto> {
    const user = await this.userService.findUserByIdPassword(
      username,
      password,
    );
    if (!user) {
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
    const accessToken = this.jwtService.sign({ username });
    const refreshToken = this.jwtService.sign(
      { username },
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

  /**
   *
   * @param req 요청 객체
   * @param res 응답 객체
   * @description 로그아웃 시 쿠키를 삭제합니다.
   * @returns 로그아웃 성공시 success: true를 포함한 ResponseDto를 반환합니다.
   */
  async logout(req: Request, res: Response): Promise<ResponseDto> {
    res.clearCookie(JWTCode.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    if (req.user) {
      await this.redisService.del(req.user?.username);
      await this.redisService.del(`${req.user?.username}_info`);
    }
    return new Promise((resolve) => {
      resolve(
        new ResponseDto(
          {
            success: true,
          },
          '',
          'Logout successful',
        ),
      );
    });
  }

  /**
   *
   * @param req 요청 객체
   * @description refreshToken을 사용하여 새로운 accessToken을 발급합니다.
   * @returns refreshToken이 유효하지 않을 경우 success: false를 포함한 ResponseDto를 반환합니다.
   */
  async refreshToken(req: Request): Promise<ResponseDto> {
    console.log(req.cookies[JWTCode.refreshToken]);
    if (!req.cookies[JWTCode.refreshToken]) {
      return new Promise((resolve) => {
        resolve(
          new ResponseDto(
            {
              accessToken: '',
              refreshToken: '',
              success: false,
            },
            'invalid_user',
            '사용자 정보가 없습니다.',
          ),
        );
      });
    }
    const refreshToken = req.cookies[JWTCode.refreshToken] as string;
    try {
      const payload: JwtPayload = this.jwtService.decode(refreshToken);
      const accessToken = this.jwtService.sign({ username: payload.username });
      return new Promise((resolve) => {
        resolve(
          new ResponseDto(
            {
              accessToken: accessToken,
              refreshToken: refreshToken,
              success: true,
            },
            '',
            'Refresh token successful',
          ),
        );
      });
    } catch (error: any) {
      console.log(error);
      return new Promise((resolve) => {
        resolve(
          new ResponseDto(
            {
              accessToken: '',
              refreshToken: '',
              success: false,
            },
            `${error}`,
            'Refresh token이 유효하지 않습니다.',
          ),
        );
      });
    }
  }
}
