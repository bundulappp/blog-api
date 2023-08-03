import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersEntity } from './user.entity';

export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
}

@Entity('user_roles')
export class UserRolesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    type: 'varchar',
    nullable: true,
    default: null,
  })
  description: string;

  @ManyToOne(() => UsersEntity, (user) => user.roles)
  @JoinColumn({ name: 'userId' })
  user: UsersEntity;
}
