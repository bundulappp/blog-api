import { Module } from '@nestjs/common';
import { BlogsService } from './services/blogs.service';
import { BlogsController } from './controller/blogs.controller';
import { BlogEntity } from 'src/entities/blog.entity';
import { BlogLikesEntity } from 'src/entities/blog-like.entity';
import { CommentEntity } from 'src/entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BlogEntity,
      BlogLikesEntity,
      CommentEntity,
      UsersEntity,
    ]),
  ],
  providers: [BlogsService],
  controllers: [BlogsController],
})
export class BlogsModule {}
