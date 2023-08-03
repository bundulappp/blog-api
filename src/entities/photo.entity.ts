import { UsersEntity } from 'src/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('photos')
export class PhotoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  filename: string;

  @Column({
    type: 'varchar',
  })
  originalname: string;

  @Column({
    type: 'varchar',
  })
  mimetype: string;

  @Column({
    type: 'varchar',
  })
  path: string;

  @Column({
    type: 'int',
  })
  size: number;

  @ManyToOne(() => UsersEntity, (user) => user.photos)
  @JoinColumn({ name: 'userId' })
  user: UsersEntity;
}
