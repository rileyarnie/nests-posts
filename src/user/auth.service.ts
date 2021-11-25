import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    //hash incoming password with a slat of 12 rounds
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    return this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async login(username: string, password: string, response: Response) {
    //find user with provided username
    const user = await this.userService.findByUsernameorEmail(username);
    if (!user) {
      throw new NotFoundException("Account doesn't exist");
    }

    //compare if passwords match
    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      throw new BadRequestException('Invalid Credentials');
    }

    const payload = { sub: user.id, username: user.username };
    const access_token = this.jwtService.sign(payload);

    // set http only cookie on the response

    response.cookie('access_token', access_token, { httpOnly: true });

    return 'Login Successful';
  }

  async getCurrentUser(access_token: string) {
    const data = await this.jwtService.verify(access_token);
    if (!data) {
      throw new UnauthorizedException();
    }
    return await this.userService.findOne(data.sub);
  }
}
