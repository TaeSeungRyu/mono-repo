import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { ResponseDto } from 'src/common/common.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    if (!loginDto.username || !loginDto.password) {
      return new ResponseDto(
        {
          success: false,
          access_token: '',
          refresh_token: '',
        },
        'error',
        '아이디 또는 비밀번호가 없습니다.',
      );
    }
    const user: ResponseDto = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    return user;
  }
}
