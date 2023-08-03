import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhotoEntity } from 'src/entities/photo.entity';

@Injectable()
export class PhotosService {
  constructor(@InjectRepository(PhotoEntity) private photoRepository) {}
}
