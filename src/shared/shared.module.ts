import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { RefreshTokenEntity } from 'src/entities/refresh-token.entity';
import { JwtAuthGuard } from 'src/shared/guards/authGuard';
import { JwtStrategy } from 'src/shared/strategies/jwtStrategy';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshTokenEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1200s' },
    }),
  ],
  providers: [JwtAuthGuard, JwtStrategy],
  exports: [JwtModule, JwtAuthGuard, JwtStrategy],
})
export class SharedModule {}
