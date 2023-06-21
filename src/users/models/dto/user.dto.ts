export class UserDto {
  readonly id: number;
  readonly username: string;
  readonly password: string;
  readonly email: string;
  readonly isActive: boolean;
  readonly isVerified: boolean;
}
