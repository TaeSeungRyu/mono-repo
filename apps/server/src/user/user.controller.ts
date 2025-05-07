import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('user')
export class UserController {
  public constructor(private service: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('my-info')
  public async getMyInfo(@Req() req: Request) {
    return await this.service.findUserById(req);
  }
}
