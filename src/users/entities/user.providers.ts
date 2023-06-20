import { DataSource } from 'typeorm';
import { UsersEntity } from './user.entity';

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UsersEntity),
    inject: ['DATA_SOURCE'],
  },
];
