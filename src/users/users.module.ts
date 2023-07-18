import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { UsersEntity } from './entities/user.entity';
import { UserRelationshipEntity } from './entities/user-relationship.entity';
import { UserRolesEntity } from './entities/user-roles.entity';
import { JwtAuthGuard } from './services/authGuard';
import * as dotenv from 'dotenv';
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
    ]),
  ],
  providers: [UsersService, JwtAuthGuard],
  controllers: [UsersController],
})
export class UsersModule {}
