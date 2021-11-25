import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/user/auth.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private authService: AuthService,
  ) {}

  async create(createPostDto: CreatePostDto, access_token: string) {
    const { id } = await this.authService.getCurrentUser(access_token);
    const createdPost = this.postRepository.create({
      ...createPostDto,
      authorId: id,
    });

    return this.postRepository.save(createdPost);
  }

  findAll() {
    return this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.authorId', 'user.id')
      .getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
