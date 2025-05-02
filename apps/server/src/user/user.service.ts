import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private users: Repository<User>,
  ) {}

  async onModuleInitSample() {
    console.log('UserService onModuleInit');
    const users = await this.users.find();
    console.log('users', users);
  }

  async findUserByIdPassword(username: string, password: string) {
    const user = await this.users.findOne({
      where: {
        username,
        password,
      },
    });
    return user;
  }
}
