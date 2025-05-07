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

  async findUserByIdPassword(username: string, password: string) {
    const user = await this.users.findOne({
      where: {
        username,
        password,
      },
    });
    return user;
  }

  async findUserById(req: Request) {
    console.log(req?.user, req?.user);
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
}
