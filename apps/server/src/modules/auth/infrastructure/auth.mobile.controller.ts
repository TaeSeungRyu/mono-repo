import { Controller, Post, Body, Get, Res, Query } from '@nestjs/common';

import { ResponseDto } from 'src/common/common.dto';
import { Request, Response } from 'express';
import { AuthService } from '../application/services/auth.service';
import { LoginDto } from '../domain/auth.dto';

@Controller('mobile/auth')
export class AuthMobileController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseDto> {
    return await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
      res,
      '60d',
    );
  }

  @Get('logout')
  async logOut(
    @Query('username') username: string,
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.authService.logout(username, res);
    res.json(result);
  }
}
