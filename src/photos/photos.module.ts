import { Module } from '@nestjs/common';
import { PhotoController } from './controller/photo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoEntity } from '../entities/photo.entity';
import { PhotosService } from './services/photos.service';

@Module({
  imports: [TypeOrmModule.forFeature([PhotoEntity])],
  controllers: [PhotoController],
  providers: [PhotosService],
})
export class PhotosModule {}
