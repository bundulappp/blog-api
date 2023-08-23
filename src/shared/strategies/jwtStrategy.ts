import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity } from '../../entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { AccessTokenPayload } from '../../users/models/acces-token.model';
import { RefreshTokenPayload } from '../../users/models/refresh-token.model';
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

  async validate(
    accessTokenPayload: AccessTokenPayload,
    refreshTokenPayload: RefreshTokenPayload,
  ): Promise<boolean> {
    const isValidAccessToken = this.validateAccessToken(accessTokenPayload);
    const isValidRefreshToken = await this.validateRefreshToken(
      refreshTokenPayload,
    );

    if (!isValidAccessToken || !isValidRefreshToken) {
      return false;
    }
    return true;
  }

  private validateAccessToken(payload: AccessTokenPayload): boolean {
    return payload.expiredAt < new Date() ? false : true;
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
