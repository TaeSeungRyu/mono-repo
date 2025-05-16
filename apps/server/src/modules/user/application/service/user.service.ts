import { Injectable } from '@nestjs/common';

import { Request } from 'express';
import { FindUserByIdPasswordUseCase } from '../use-cases/find-id-password.use-case';
import { FindUserByIdUseCase } from '../use-cases/find-id.use-case';
import { SignUpUseCase } from '../use-cases/sign-up.use-case';
import { UpdateUserInfoUseCase } from '../use-cases/update-user.use-case';
import { ResponseDto } from 'src/common/common.dto';
import { User } from '../../domain/user.entity';
import { FindUserWithPagingUseCase } from '../use-cases/find-paging.use-case';
import { UserDto } from '../../domain/user.dto';

@Injectable()
export class UserService {
  constructor(
    private findUserByIdPasswordUseCase: FindUserByIdPasswordUseCase,
    private findUserByIdUseCase: FindUserByIdUseCase,
    private signUpUseCase: SignUpUseCase,
    private updateUserInfoUseCase: UpdateUserInfoUseCase,
    private findUserWithPagingUseCase: FindUserWithPagingUseCase,
  ) {}
  /**
   *
   * @param username  사용자 아이디
   * @param password  사용자 비밀번호
   * @description 사용자 정보를 조회합니다.
   * @returns 사용자 정보
   */
  async findUserByIdPassword(
    username: string,
    password: string,
  ): Promise<ResponseDto> {
    return this.findUserByIdPasswordUseCase.execute({
      username,
      password,
    });
  }

  /**
   *
   * @param req 요청 객체
   * @description 사용자 정보를 조회합니다.
   * @returns 사용자 정보
   */
  async findUserById(req: Request): Promise<ResponseDto> {
    return this.findUserByIdUseCase.execute(req);
  }

  /**
   *
   * @param body 사용자 정보
   * @description 사용자 정보를 수정합니다.
   * @returns  사용자 정보 수정 결과
   */
  async updateUserInfo(body: UserDto): Promise<ResponseDto> {
    return this.updateUserInfoUseCase.execute(body);
  }

  async signUp(body: User): Promise<ResponseDto> {
    return this.signUpUseCase.execute(body);
  }

  /**
   *
   * @param body 사용자 정보 목록
   * @returns 사용자 정보 목록
   * @description 사용자 정보를 페이지네이션하여 조회합니다.
   */
  async findUserWithPaging(body: UserDto): Promise<ResponseDto> {
    return this.findUserWithPagingUseCase.execute(body);
  }
}
