import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersEntity } from './user.entity';
import { BlogEntity } from './blog.entity';

@Entity('blog_likes')
export class BlogLikesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersEntity, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: UsersEntity;

  @ManyToOne(() => BlogEntity, (blog) => blog.id)
  @JoinColumn({ name: 'blogId' })
  blog: BlogEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  likedAt: Date;
}
