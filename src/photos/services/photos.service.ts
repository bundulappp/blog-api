import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhotoEntity } from 'src/entities/photo.entity';
import { PhotoUploadDto } from '../models/photo-upload.dto';
import { UsersEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(PhotoEntity)
    private photoRepository: Repository<PhotoEntity>,
  ) {}

  async uploadSingle(photoDto: PhotoUploadDto, userEntity: UsersEntity) {
    const photoEntity = new PhotoEntity();
    photoEntity.filename = photoDto.filename;
    photoEntity.originalname = photoDto.originalname;
    photoEntity.mimetype = photoDto.mimetype;
    photoEntity.path = photoDto.path;
    photoEntity.size = photoDto.size;
    photoEntity.user = userEntity;

    return await this.photoRepository.save(photoEntity);
  }
}
