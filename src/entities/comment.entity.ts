import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UsersEntity } from './user.entity';
import { BlogEntity } from './blog.entity';

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => UsersEntity, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'authorId' })
  author: UsersEntity;

  @ManyToOne(() => BlogEntity, (blog) => blog.id, {
    eager: true,
    cascade: ['remove'],
  })
  @JoinColumn({ name: 'blogId' })
  blog: BlogEntity;
}
