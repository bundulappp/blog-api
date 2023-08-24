import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BlogEntity } from 'src/entities/blog.entity';
import { JwtAuthGuard } from 'src/shared/guards/authGuard';
import { BlogsService } from '../services/blogs.service';
import { CreateBlogDto } from '../dto/create-blog,dto';
import { User } from 'src/users/decorator/user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { getStorageConfig } from 'src/utilities/storageCongif';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  findAll(): Promise<BlogEntity[]> {
    return this.blogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<BlogEntity> {
    return this.blogsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('image', 10, getStorageConfig('./uploads/blog-images')),
  )
  @Post()
  create(
    @User() userToken,
    @Body() createBlogDto: CreateBlogDto,
  ): Promise<BlogEntity> {
    return this.blogsService.create(userToken, createBlogDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() blog: BlogEntity,
  ): Promise<void> {
    return this.blogsService.update(id, blog);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.blogsService.remove(id);
  }
}
