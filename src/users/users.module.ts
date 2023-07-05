import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from './entities/user.providers';
import { JwtAuthGuard } from './services/authGuard';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1200s' },
    }),
  ],
  controllers: [UsersController],
  providers: [...userProviders, UsersService, JwtAuthGuard],
})
export class UsersModule {}
