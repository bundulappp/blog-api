export interface AccessTokenPayload {
  userId: number;
  username: string;
  email: string;
  expiredAt: Date;
}
