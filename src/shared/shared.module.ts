import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { JwtAuthGuard } from 'src/shared/guards/authGuard';
import { JwtStrategy } from 'src/shared/strategies/jwtStrategy';
dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1200s' },
    }),
  ],
  providers: [JwtAuthGuard, JwtStrategy],
  exports: [JwtModule, JwtAuthGuard],
})
export class SharedModule {}
