import {
  ConflictException,
  Injectable,
  NotFoundException,
  Put,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogLikesEntity } from 'src/entities/blog-like.entity';
import { BlogEntity } from 'src/entities/blog.entity';
import { CommentEntity } from 'src/entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateBlogDto } from '../dto/create-blog,dto';
import { UsersEntity } from 'src/entities/user.entity';
import { AccessTokenPayload } from 'src/users/models/acces-token.model';
import { PhotoUploadDto } from 'src/photos/dto/photoUploadDto';
import { PhotoEntity } from 'src/entities/photo.entity';

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
    @InjectRepository(PhotoEntity)
    private photoRepository: Repository<PhotoEntity>,
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
    photoDto: PhotoUploadDto,
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

    const photoEntity = new PhotoEntity();
    photoEntity.filename = photoDto.filename;
    photoEntity.originalname = photoDto.originalname;
    photoEntity.mimetype = photoDto.mimetype;
    photoEntity.path = photoDto.path;
    photoEntity.size = photoDto.size;
    photoEntity.user = user;
    photoEntity.blog = savedBlog;

    await this.photoRepository.save(photoEntity);

    return savedBlog;
  }

  async update(id: number, blog: BlogEntity): Promise<void> {
    await this.blogRepository.update(id, blog);
  }

  async remove(id: number): Promise<void> {
    await this.blogRepository.delete(id);
  }

  async likeBlog(id: number, userToken: AccessTokenPayload): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userToken.id },
    });

    if (!user) {
      throw new UnauthorizedException('User is not found or not authorized');
    }

    const blog = await this.blogRepository.findOne({ where: { id: id } });

    if (!blog) {
      throw new NotFoundException('Blog is not found');
    }

    const userIsAlreadyLiked = await this.blogLikeRepository.findOne({
      where: { user: user, blog: blog },
    });

    if (userIsAlreadyLiked) {
      throw new ConflictException('User has already liked this blog');
    }

    const blogLikeEntity = new BlogLikesEntity();
    blogLikeEntity.likedAt = new Date();
    blogLikeEntity.blog = blog;
    blogLikeEntity.user = user;
    await this.blogLikeRepository.save(blogLikeEntity);

    await this.blogRepository.update(blog.id, {
      likeCount: blog.likeCount + 1,
    });
  }

  async dislikeBlog(id: number, userToken: AccessTokenPayload): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userToken.id },
    });

    if (!user) {
      throw new UnauthorizedException('User is not found or not authorized');
    }

    const blog = await this.blogRepository.findOne({ where: { id: id } });

    if (!blog) {
      throw new NotFoundException('Blog is not found');
    }

    const blogLikeEntity = await this.blogLikeRepository.findOne({
      where: { user: user, blog: blog },
    });

    if (!blogLikeEntity) {
      throw new ConflictException('User does not like this blog yet');
    }

    await this.blogRepository.update(blog.id, {
      likeCount: blog.likeCount - 1,
    });

    await this.blogLikeRepository.remove(blogLikeEntity);
  }
}
