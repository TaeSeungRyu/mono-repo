import { Controller, Post, Body, Get, Req, Res } from '@nestjs/common';

import { ResponseDto } from 'src/common/common.dto';
import { Request, Response } from 'express';
import { AuthService } from '../application/services/auth.service';
import { LoginDto } from '../domain/auth.dto';

@Controller('auth')
export class AuthController {
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
    );
  }

  @Get('logout')
  async logout(@Req() req: Request, res: Response): Promise<ResponseDto> {
    return this.authService.logout(req, res);
  }

  @Get('refresh-token')
  async refreshToken(@Req() req: Request): Promise<ResponseDto> {
    return this.authService.refreshToken(req);
  }
}
