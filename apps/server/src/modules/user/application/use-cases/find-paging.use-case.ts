import { InjectRepository } from '@nestjs/typeorm';
import { CommonUseCase } from 'src/common/common.usecase';
import { Repository } from 'typeorm';
import { ResponseDto } from 'src/common/common.dto';
import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user.entity';
import { UserDto } from '../../domain/user.dto';

@Injectable()
export class FindUserWithPagingUseCase implements CommonUseCase<UserDto> {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async execute(req: UserDto): Promise<ResponseDto> {
    const query = this.userRepo.createQueryBuilder('user');
    if (req.username) {
      query.andWhere('user.username LIKE :username', {
        username: `%${req.username}%`,
      });
    }
    if (req.name) {
      query.andWhere('user.name LIKE :name', {
        name: `%${req.name}%`,
      });
    }
    const page = req.page || 1;
    const limit = req.limit || 10;
    query
      .skip((page - 1) * limit)
      .take(limit)
      .select(['user.id', 'user.username', 'user.name', 'user.lastlogin'])
      .orderBy('user.id', 'DESC');
    const [data, total] = await query.getManyAndCount();
    const totalPage = Math.ceil(total / limit);

    return new ResponseDto(
      {
        success: true,
        data: {
          data,
          total,
          page,
          limit,
          totalPage,
        },
      },
      'success',
      '사용자 목록 조회 성공',
    );
  }
}
