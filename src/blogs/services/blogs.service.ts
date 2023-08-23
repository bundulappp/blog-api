import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogLikesEntity } from 'src/entities/blog-like.entity';
import { BlogEntity } from 'src/entities/blog.entity';
import { CommentEntity } from 'src/entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateBlogDto } from '../dto/create-blog,dto';
import { UsersEntity } from 'src/entities/user.entity';
import { AccessTokenPayload } from 'src/users/models/acces-token.model';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
    @InjectRepository(BlogLikesEntity)
    private blogLikeRepository: Repository<BlogLikesEntity>,
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
  ) {}

  findAll(): Promise<BlogEntity[]> {
    return this.blogRepository.find();
  }

  findOne(id: number): Promise<BlogEntity> {
    return this.blogRepository.findOne({ where: { id: id } });
  }

  async create(
    userToken: AccessTokenPayload,
    blog: CreateBlogDto,
  ): Promise<BlogEntity> {
    const user = await this.userRepository.findOne({
      where: { id: userToken.id },
    });

    if (!user) {
      throw new UnauthorizedException('User not authorized or not found');
    }

    const blogEntity = new BlogEntity();
    blogEntity.author = user;
    blogEntity.title = blog.title;
    blogEntity.content = blog.content;
    blogEntity.createdAt = new Date();
    blogEntity.updatedAt = new Date();

    const savedBlog = await this.blogRepository.save(blogEntity);

    return savedBlog;
  }

  async update(id: number, blog: BlogEntity): Promise<void> {
    await this.blogRepository.update(id, blog);
  }

  async remove(id: number): Promise<void> {
    await this.blogRepository.delete(id);
  }
}
