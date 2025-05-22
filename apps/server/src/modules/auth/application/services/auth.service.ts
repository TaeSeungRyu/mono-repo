import { Injectable } from '@nestjs/common';

import { Request, Response } from 'express';
import { ResponseDto } from 'src/common/common.dto';

import { LogOutUseCase } from '../use-cases/log-out.use-case';
import { RefreshTokenUseCase } from '../use-cases/refresh-token.use-case';
import { ValidateUserUseCase } from '../use-cases/validate-user.use-case';

@Injectable()
export class AuthService {
  constructor(
    private logOutuseCase: LogOutUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
    private validateUserUseCase: ValidateUserUseCase,
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
    return this.validateUserUseCase.execute({
      username,
      password,
      res,
    });
  }

  /**
   *
   * @param req 요청 객체
   * @param res 응답 객체
   * @description 로그아웃 시 쿠키를 삭제합니다.
   * @returns 로그아웃 성공시 success: true를 포함한 ResponseDto를 반환합니다.
   */
  async logout(username: string, res: Response): Promise<ResponseDto> {
    return this.logOutuseCase.execute({ username, res });
  }

  /**
   *
   * @param req 요청 객체
   * @description refreshToken을 사용하여 새로운 accessToken을 발급합니다.
   * @returns refreshToken이 유효하지 않을 경우 success: false를 포함한 ResponseDto를 반환합니다.
   */
  async refreshToken(req: Request): Promise<ResponseDto> {
    return this.refreshTokenUseCase.execute(req);
  }
}
