import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class UsersEntity {
  constructor(partial: Partial<UsersEntity>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'string',
    length: 17,
    unique: true,
  })
  username: string;

  @Column({
    type: 'string',
  })
  password: string;

  @Column({ type: 'string', length: 80, unique: true })
  email: string;
}
