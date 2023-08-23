import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { BlogEntity } from 'src/entities/blog.entity';
import { JwtAuthGuard } from 'src/users/services/authGuard';
import { BlogsService } from '../services/blogs.service';

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
  @Post()
  create(@Body() blog: BlogEntity): Promise<BlogEntity> {
    return this.blogsService.create(blog);
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
