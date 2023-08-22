import { Module } from '@nestjs/common';
import { BlogsService } from './services/blogs.service';
import { BlogsController } from './controller/blogs.controller';

@Module({
  providers: [BlogsService],
  controllers: [BlogsController],
})
export class BlogsModule {}
