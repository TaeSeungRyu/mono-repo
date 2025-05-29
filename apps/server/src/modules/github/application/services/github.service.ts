import { Injectable } from '@nestjs/common';
import { GithubDto } from '../../domain/user.dto';
import { FindGihubUseCase } from '../use-cases/find-github.use-case';
import { ResponseDto } from 'src/common/common.dto';

@Injectable()
export class GithubService {
  constructor(private readonly findGihubUseCase: FindGihubUseCase) {}

  async findPaging(req: GithubDto): Promise<ResponseDto> {
    return await this.findGihubUseCase.execute(req);
  }
}
