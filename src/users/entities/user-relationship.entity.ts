//create a new table such as user-relationship to store relationship between users.
// the table will have two columns: followerId and followingId.
//Establish a one-to-many relationship between the user and user-relationship tables.

// Path: src\users\entities\user-relationship.entity.ts

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { UsersEntity } from './user.entity';

@Entity('user_relationship')
export class UserRelationshipEntity {
  constructor(partial: Partial<UserRelationshipEntity>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    nullable: true,
    default: null,
  })
  followerId: number;

  @Column({
    type: 'int',
    nullable: true,
    default: null,
  })
  followedId: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => UsersEntity, (user) => user.followers)
  @JoinColumn({ name: 'followerId' })
  follower: UsersEntity;

  @ManyToOne(() => UsersEntity, (user) => user.followings)
  @JoinColumn({ name: 'followedId' })
  followed: UsersEntity;
}
