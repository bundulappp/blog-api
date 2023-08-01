import { Module } from '@nestjs/common';
import { PhotoController } from './controller/photo.controller';

@Module({
  controllers: [PhotoController],
})
export class PhotosModule {}
