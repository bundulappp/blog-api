import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogLikesEntity } from 'src/entities/blog-like.entity';
import { BlogEntity } from 'src/entities/blog.entity';
import { CommentEntity } from 'src/entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
    @InjectRepository(BlogLikesEntity)
    private blogLikeRepository: Repository<BlogLikesEntity>,
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
  ) {}

  findAll(): Promise<BlogEntity[]> {
    return this.blogRepository.find();
  }

  findOne(id: number): Promise<BlogEntity> {
    return this.blogRepository.findOne({ where: { id: id } });
  }

  create(blog: BlogEntity): Promise<BlogEntity> {
    return this.blogRepository.save(blog);
  }

  async update(id: number, blog: BlogEntity): Promise<void> {
    await this.blogRepository.update(id, blog);
  }

  async remove(id: number): Promise<void> {
    await this.blogRepository.delete(id);
  }
}
