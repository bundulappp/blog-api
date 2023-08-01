import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './services/users.service';
import { UsersController } from './controller/users.controller';
import { UsersEntity } from './entities/user.entity';
import { UserRelationshipEntity } from './entities/user-relationship.entity';
import { UserRolesEntity } from './entities/user-roles.entity';
import { JwtAuthGuard } from './services/authGuard';
import * as dotenv from 'dotenv';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { JwtStrategy } from './services/jwtStrategy';
dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30m' },
    }),
    TypeOrmModule.forFeature([
      UsersEntity,
      UserRelationshipEntity,
      UserRolesEntity,
      RefreshTokenEntity,
    ]),
  ],
  providers: [UsersService, JwtAuthGuard, JwtStrategy],
  controllers: [UsersController],
})
export class UsersModule {}
