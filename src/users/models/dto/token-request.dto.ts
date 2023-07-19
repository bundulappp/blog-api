import { AccessTokenPayload } from '../acces-token.model';
import { RefreshTokenPayload } from '../refresh-token.model';

export interface TokenRequestDto {
  accessToken: AccessTokenPayload;
  refreshToken: RefreshTokenPayload;
}
