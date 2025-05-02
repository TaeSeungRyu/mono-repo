import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseDto } from 'src/common/common.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<ResponseDto> {
    const token = this.jwtService.sign({ username });
    console.log(password); //userservice에서 password를 확인하는 로직이 필요합니다.
    return new Promise((resolve) => {
      resolve({
        result: {
          success: true,
          access_token: token,
          refresh_token: token,
        },
        error: '',
        message: 'Login successful',
      });
    });
  }
}
