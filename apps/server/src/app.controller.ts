import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('auth-health')
  @UseGuards(AuthGuard('jwt'))
  getAuthHealth(@Req() req: Request): string {
    console.log(req.cookies['refresh_token']); // ✅ 특정 쿠키
    return 'Auth service is healthy!';
  }
}
