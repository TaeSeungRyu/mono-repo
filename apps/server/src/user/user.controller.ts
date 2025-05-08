import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  public constructor(private service: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('my-info')
  public async getMyInfo(@Req() req: Request) {
    return await this.service.findUserById(req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update-info')
  public async updateInfo(@Body() body: User) {
    return await this.service.updateUserInfo(body);
  }

  @Post('signup')
  public async signUp(@Body() body: User) {
    return await this.service.signUp(body);
  }
}
