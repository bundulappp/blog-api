import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './services/users.service';
import { UsersController } from './controller/users.controller';
import { UsersEntity } from '../entities/user.entity';
import { UserRelationshipEntity } from '../entities/user-relationship.entity';
import { UserRolesEntity } from '../entities/user-roles.entity';
import { JwtAuthGuard } from '../shared/guards/authGuard';
import * as dotenv from 'dotenv';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';
import { JwtStrategy } from './services/jwtStrategy';
import { PhotosService } from 'src/photos/services/photos.service';
import { PhotoEntity } from 'src/entities/photo.entity';
dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1200s' },
    }),
    TypeOrmModule.forFeature([
      UsersEntity,
      UserRelationshipEntity,
      UserRolesEntity,
      RefreshTokenEntity,
      PhotoEntity,
    ]),
  ],
  providers: [UsersService, JwtAuthGuard, JwtStrategy, PhotosService],
  controllers: [UsersController],
  exports: [JwtAuthGuard],
})
export class UsersModule {}
