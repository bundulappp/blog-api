import { Module } from '@nestjs/common';
import { PhotoController } from './photo/photo.controller';

@Module({
  controllers: [PhotoController]
})
export class PhotosModule {}
