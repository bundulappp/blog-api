import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { AccessTokenPayload } from '../models/acces-token.model';
import { TokenRequestDto } from '../models/dto/token-request.dto';
import { RefreshTokenPayload } from '../models/refresh-token.model';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: TokenRequestDto): Promise<boolean> {
    const isValidAccessToken = this.validateAccessToken(payload.accessToken);

    if (!isValidAccessToken) {
      return false;
    }

    const isValidRefreshToken = await this.validateRefreshToken(
      payload.refreshToken,
    );

    if (!isValidRefreshToken) {
      return false;
    }

    return true;
  }

  private validateAccessToken(payload: AccessTokenPayload): boolean {
    if (payload.expiredAt < new Date()) {
      return false;
    }

    return true;
  }

  private async validateRefreshToken(
    payload: RefreshTokenPayload,
  ): Promise<boolean> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: {
        token: payload.token,
      },
    });

    if (
      !refreshToken ||
      refreshToken.isRevoked ||
      refreshToken.isUsed ||
      refreshToken.expiresAt < new Date()
    ) {
      return false;
    }

    this.refreshTokenRepository.update(refreshToken.id, {
      isUsed: true,
    });

    return !!refreshToken;
  }
}
