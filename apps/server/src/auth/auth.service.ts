import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { ResponseDto } from 'src/common/common.dto';
import { UserService } from 'src/user/user.service';
import { JWTCode, JwtPayload } from './jwt-payload.interface';
import { RedisService } from 'src/redis/redis.service';
import { User } from 'src/user/user.entity';

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
   * @returns 로그인 성공시 access_token과 refresh_token을 포함한 ResponseDto를 반환합니다.
   * @returns 로그인 실패시 access_token과 refresh_token이 빈 문자열인 ResponseDto를 반환합니다.
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
              access_token: '',
              refresh_token: '',
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

    this.setCookieAndRedisCache(res, user, refreshToken);

    return new Promise((resolve) => {
      resolve(
        new ResponseDto(
          {
            access_token: accessToken,
            refresh_token: refreshToken,
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
   * @param refresh_token refresh_token
   * @description 쿠키에 refresh_token을 설정하고 Redis에 캐시합니다.
   */
  private setCookieAndRedisCache(
    res: Response,
    user: User,
    refresh_token: string,
  ): void {
    res.cookie(JWTCode.refreshToken, refresh_token, {
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
        await this.redisService.set(user.username, refresh_token, 60 * 60 * 1); // 1시간
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
   * @description refresh_token을 사용하여 새로운 access_token을 발급합니다.
   * @returns refresh_token이 유효하지 않을 경우 success: false를 포함한 ResponseDto를 반환합니다.
   */
  async refreshToken(req: Request): Promise<ResponseDto> {
    if (!req.user) {
      return new Promise((resolve) => {
        resolve(
          new ResponseDto(
            {
              access_token: '',
              refresh_token: '',
              success: false,
            },
            'invalid_user',
            '사용자 정보가 없습니다.',
          ),
        );
      });
    }
    const refreshToken = req.cookies[JWTCode.refreshToken] as string;
    const savedRefreshToken = await this.redisService.get(req.user?.username);

    if (!refreshToken || refreshToken !== savedRefreshToken) {
      return new Promise((resolve) => {
        resolve(
          new ResponseDto(
            {
              access_token: '',
              refresh_token: '',
              success: false,
            },
            'invalid_refresh_token',
            'Refresh token이 없습니다.',
          ),
        );
      });
    }
    try {
      const payload: JwtPayload = this.jwtService.decode(refreshToken);
      const accessToken = this.jwtService.sign({ username: payload.username });
      return new Promise((resolve) => {
        resolve(
          new ResponseDto(
            {
              access_token: accessToken,
              refresh_token: refreshToken,
              success: true,
            },
            '',
            'Refresh token successful',
          ),
        );
      });
    } catch (error: any) {
      return new Promise((resolve) => {
        resolve(
          new ResponseDto(
            {
              access_token: '',
              refresh_token: '',
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
