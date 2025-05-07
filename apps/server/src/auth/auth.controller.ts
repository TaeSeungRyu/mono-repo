import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { ResponseDto } from 'src/common/common.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<ResponseDto> {
    return await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
  }
}
