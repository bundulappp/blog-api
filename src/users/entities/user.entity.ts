import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { UserRelationshipEntity } from './user-relationship.entity';
import { UserRolesEntity } from './user-roles.entity';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 17,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
  })
  password: string;

  @Column({ type: 'varchar', length: 80, unique: true })
  email: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(
    () => UserRelationshipEntity,
    (relationship) => relationship.followerId,
    { cascade: true },
  )
  followers: UserRelationshipEntity[];

  @OneToMany(
    () => UserRelationshipEntity,
    (relationship) => relationship.followedId,
    { cascade: true },
  )
  followings: UserRelationshipEntity[];

  @OneToMany(() => UserRolesEntity, (roles) => roles.user)
  roles: UserRolesEntity;
}
