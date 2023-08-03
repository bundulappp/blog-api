import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersEntity } from './user.entity';

@Entity('refresh_token')
export class RefreshTokenEntity {
  constructor(partial: Partial<RefreshTokenEntity>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersEntity, (user) => user.refreshTokens)
  @JoinColumn({ name: 'userId' })
  user: UsersEntity;

  @Column({
    type: 'varchar',
    length: 255,
  })
  token: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isRevoked: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  isUsed: boolean;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  expiresAt: Date;
}
