import { Module } from '@nestjs/common';
import { BlogsService } from './services/blogs.service';
import { BlogsController } from './controller/blogs.controller';
import { JwtAuthGuard } from 'src/users/services/authGuard';

@Module({
  imports: [JwtAuthGuard],
  providers: [BlogsService],
  controllers: [BlogsController],
})
export class BlogsModule {}
