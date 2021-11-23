import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      //hash incoming password with a slat of 12 rounds
      const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
      return await this.userRepository.save({
        ...createUserDto,
        password: hashedPassword,
      });
    } catch (error) {
      if (error.errno === 1062) {
        throw new ConflictException('Email or Username already in use');
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    const user = await this.userRepository.find();
    if (!user) {
      throw new NotFoundException('The user could not be found');
    }
    return user;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new NotFoundException('The user could not be found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
