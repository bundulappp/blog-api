export interface RefreshTokenPayload {
  id: number;
  userId: number;
  token: string;
  isRevoked: boolean;
  isUsed: boolean;
  addedAt: Date;
  expiresAt: Date;
}
