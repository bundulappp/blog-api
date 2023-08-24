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
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { BlogEntity } from 'src/entities/blog.entity';
import { JwtAuthGuard } from 'src/shared/guards/authGuard';
import { BlogsService } from '../services/blogs.service';
import { CreateBlogDto } from '../dto/create-blog,dto';
import { User } from 'src/users/decorator/user.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { getStorageConfig } from 'src/utilities/storageCongif';
import { AccessTokenPayload } from 'src/users/models/acces-token.model';

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
    FileInterceptor('image', getStorageConfig('./uploads/blog-images')),
  )
  @Post()
  create(
    @User() userToken,
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() file,
  ): Promise<BlogEntity> {
    return this.blogsService.create(userToken, createBlogDto, file);
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

  @UseGuards(JwtAuthGuard)
  @Put('/:blogId/like')
  async likeBlog(
    @Param('blogId') blogId: number,
    @User() userToken: AccessTokenPayload,
  ) {
    return this.blogsService.likeBlog(blogId, userToken);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:blogId/dislike')
  async dislikeBlog(
    @Param('blogId') blogId: number,
    @User() userToken: AccessTokenPayload,
  ) {
    return this.blogsService.dislikeBlog(blogId, userToken);
  }
}
