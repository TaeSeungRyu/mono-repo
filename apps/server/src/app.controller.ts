import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { SkipThrottle } from '@nestjs/throttler';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor() {}

  @SkipThrottle({ default: false })
  @Get()
  getHello(): string {
    return 'hello world!';
  }

  @Get('auth-health')
  @UseGuards(AuthGuard('jwt'))
  getAuthHealth(@Req() req: Request): string {
    console.log(req.cookies['refreshToken']); // ✅ 특정 쿠키
    return 'Auth service is healthy!';
  }
}
