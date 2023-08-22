import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UsersEntity } from './user.entity';
import { CommentEntity } from './comment.entity';
import { BlogLikesEntity } from './blog-like.entity';

@Entity('blogs')
export class BlogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  title: string;

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

  @OneToMany(() => CommentEntity, (comment) => comment.blog)
  comments: CommentEntity[];

  @Column({ type: 'int', default: 0 })
  likeCount: number;

  @OneToMany(() => BlogLikesEntity, (like) => like.blog)
  likes: BlogLikesEntity[];
}
