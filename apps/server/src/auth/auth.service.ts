import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { ResponseDto } from 'src/common/common.dto';
import { UserService } from 'src/user/user.service';
import { JWTCode, JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
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
    const access_token = this.jwtService.sign({ username });
    const refresh_token = this.jwtService.sign(
      { username },
      { expiresIn: '1d' },
    );
    res.cookie(JWTCode.refresh_token, refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return new Promise((resolve) => {
      resolve(
        new ResponseDto(
          {
            access_token,
            refresh_token,
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
   * @param req 요청 객체
   * @param res 응답 객체
   * @description 로그아웃 시 쿠키를 삭제합니다.
   * @returns 로그아웃 성공시 success: true를 포함한 ResponseDto를 반환합니다.
   */
  async logout(req: Request, res: Response): Promise<ResponseDto> {
    res.clearCookie(JWTCode.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
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
    const refresh_token = req.cookies[JWTCode.refresh_token] as string;
    if (!refresh_token) {
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
      const payload: JwtPayload = this.jwtService.decode(refresh_token);
      const access_token = this.jwtService.sign({ username: payload.username });
      return new Promise((resolve) => {
        resolve(
          new ResponseDto(
            {
              access_token,
              refresh_token,
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
