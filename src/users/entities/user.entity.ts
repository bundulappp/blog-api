import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UsersEntity {
  constructor(partial: Partial<UsersEntity>) {
    Object.assign(this, partial);
  }

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
}
