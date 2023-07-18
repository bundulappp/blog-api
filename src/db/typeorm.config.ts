import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserRelationshipEntity } from 'src/users/entities/user-relationship.entity';
import { UserRolesEntity } from 'src/users/entities/user-roles.entity';
import { UsersEntity } from 'src/users/entities/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: process.env.DB_PASSWORD,
  database: 'blog',
  entities: [UsersEntity, UserRelationshipEntity, UserRolesEntity],
  migrations: [__dirname + '/../migrations/*.js'],
  migrationsTableName: 'migrations',
  synchronize: true,
};
