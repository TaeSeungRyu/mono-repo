import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseDto } from 'src/common/common.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateUser(username: string, password: string): Promise<ResponseDto> {
    const user = await this.userService.findUserByIdPassword(
      username,
      password,
    );
    if (!user) {
      return new Promise((resolve) => {
        resolve(
          new ResponseDto(
            {
              access_token: '',
              refresh_token: '',
              success: false,
            },
            'invalid_credentials',
            '아이디 또는 비밀번호가 틀립니다.',
          ),
        );
      });
    }
    const access_token = this.jwtService.sign({ username });
    const refresh_token = this.jwtService.sign(
      { username },
      { expiresIn: '1d' },
    );
    return new Promise((resolve) => {
      resolve({
        result: {
          success: true,
          access_token,
          refresh_token,
        },
        error: '',
        message: 'Login successful',
      });
    });
  }
}
