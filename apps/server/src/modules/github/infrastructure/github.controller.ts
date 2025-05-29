import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GithubService } from '../application/services/github.service';
import { AuthGuard } from '@nestjs/passport';
import { GithubDto } from '../domain/user.dto';
import { ResponseDto } from 'src/common/common.dto';

@Controller('github')
export class GithubController {
  constructor(private service: GithubService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('')
  public async findPaging(@Query() req: GithubDto): Promise<ResponseDto> {
    return await this.service.findPaging(req);
  }
}
