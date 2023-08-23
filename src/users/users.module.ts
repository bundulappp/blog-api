import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './services/users.service';
import { UsersController } from './controller/users.controller';
import { UsersEntity } from '../entities/user.entity';
import { UserRelationshipEntity } from '../entities/user-relationship.entity';
import { UserRolesEntity } from '../entities/user-roles.entity';
import * as dotenv from 'dotenv';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';
import { PhotosService } from 'src/photos/services/photos.service';
import { PhotoEntity } from 'src/entities/photo.entity';
import { SharedModule } from 'src/shared/shared.module';
dotenv.config();

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([
      UsersEntity,
      UserRelationshipEntity,
      UserRolesEntity,
      RefreshTokenEntity,
      PhotoEntity,
    ]),
  ],
  providers: [UsersService, PhotosService],
  controllers: [UsersController],
})
export class UsersModule {}
