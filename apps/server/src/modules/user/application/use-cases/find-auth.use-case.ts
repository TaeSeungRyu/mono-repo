import { InjectRepository } from '@nestjs/typeorm';
import { CommonUseCase } from 'src/common/common.usecase';
import { Repository } from 'typeorm';
import { ResponseDto } from 'src/common/common.dto';
import { Injectable } from '@nestjs/common';
import { Auth } from '../../domain/auth.entity';

@Injectable()
export class FindAuthUseCase implements CommonUseCase {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepo: Repository<Auth>,
  ) {}

  async execute(): Promise<ResponseDto> {
    const data = await this.authRepo.find();
    return new ResponseDto(
      { success: true, data: data },
      'success',
      '조회 성공',
    );
  }
}
