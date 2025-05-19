import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from '../application/service/user.service';
import { User } from '../domain/user.entity';
import { UserDto } from '../domain/user.dto';
import { Roles } from 'src/modules/auth/application/services/roles.decorator';

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
  public async updateInfo(@Body() body: UserDto) {
    return await this.service.updateUserInfo(body);
  }

  @Post('signup')
  public async signUp(@Body() body: User) {
    return await this.service.signUp(body);
  }

  @Roles('super', 'admin')
  @Get('find-paging')
  public async findPaging(@Query() req: UserDto) {
    return await this.service.findUserWithPaging(req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('delete')
  public async deleteInfo(@Body() body: UserDto) {
    return await this.service.deleteUserInfo(body);
  }
}
