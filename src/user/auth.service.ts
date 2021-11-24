import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async register(createUserDto: CreateUserDto) {
    //hash incoming password with a slat of 12 rounds
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    return this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }
}
