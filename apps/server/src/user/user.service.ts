import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { ResponseDto } from 'src/common/common.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private users: Repository<User>,
  ) {}

  /**
   *
   * @param username  사용자 아이디
   * @param password  사용자 비밀번호
   * @description 사용자 정보를 조회합니다.
   * @returns 사용자 정보
   */
  async findUserByIdPassword(username: string, password: string) {
    const user = await this.users.findOne({
      where: {
        username,
        password,
      },
    });
    return user;
  }

  /**
   *
   * @param req 요청 객체
   * @description 사용자 정보를 조회합니다.
   * @returns 사용자 정보
   */
  async findUserById(req: Request): Promise<ResponseDto> {
    if (req?.user && req?.user?.username) {
      const username = req?.user?.username;
      const user = await this.users.findOne({
        where: {
          username,
        },
        select: {
          username: true,
          name: true,
          lastlogin: true,
          id: true,
        },
      });
      return new ResponseDto(
        { success: true, data: user },
        'success',
        '사용자 정보 조회 성공',
      );
    }
    return new ResponseDto(
      {
        success: false,
        access_token: '',
        refresh_token: '',
      },
      'error',
      '정보가 없습니다.',
    );
  }

  /**
   *
   * @param body 사용자 정보
   * @description 사용자 정보를 수정합니다.
   * @returns  사용자 정보 수정 결과
   */
  async updateUserInfo(body: User) {
    const user = await this.users.findOne({
      where: {
        id: body.id,
      },
    });
    if (user) {
      const { id, ...rest } = body;
      // null 또는 undefined가 아닌 값만 필터링
      const updateData = Object.fromEntries(
        Object.entries(rest).filter(
          ([, value]) => value !== null && value !== undefined,
        ),
      );
      delete updateData['username'];
      await this.users.update(id, updateData);
      return new ResponseDto(
        { success: true },
        'success',
        '사용자 정보 수정 성공',
      );
    } else {
      return new ResponseDto(
        { success: false },
        'error',
        '사용자 정보 수정 실패',
      );
    }
  }
}
