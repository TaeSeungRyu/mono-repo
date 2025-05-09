import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { ResponseDto } from 'src/common/common.dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private users: Repository<User>,
    private readonly redisService: RedisService,
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
      select: {
        username: true,
        name: true,
        lastlogin: true,
        id: true,
      },
    });
    return user;
  }

  private stringToJson(arg: string | null): unknown {
    if (!arg) {
      return null; // 또는 적절한 기본값을 반환
    }
    try {
      return JSON.parse(arg);
    } catch (error) {
      console.error('JSON parsing error:', error);
      return null; // 또는 적절한 기본값을 반환
    }
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
      let user = await this.redisService.get(`${username}_info`);
      if (!user) {
        const userInfo = await this.users.findOne({
          where: {
            username,
          },
        });
        if (userInfo) {
          await this.redisService.set(
            `${username}_info`,
            JSON.stringify(userInfo),
            60 * 60 * 24,
          );
        }
        user = await this.redisService.get(`${username}_info`);
      }

      const data = this.stringToJson(user);
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
      await this.redisService.set(
        `${user.username}_info`,
        JSON.stringify({
          ...user,
          ...updateData,
        }),
      );
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

  async signUp(body: User) {
    const { username, password, name } = body;
    const user = await this.users.findOne({
      where: {
        username,
      },
    });
    if (user) {
      return new ResponseDto(
        { success: false },
        'error',
        '이미 존재하는 사용자입니다.',
      );
    } else {
      const newUser = this.users.create({
        username,
        password,
        name,
      });
      await this.users.save(newUser);
      return new ResponseDto({ success: true }, 'success', '사용자 등록 성공');
    }
  }
}
