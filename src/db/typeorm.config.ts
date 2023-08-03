import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: process.env.DB_PASSWORD,
  database: 'blog',
  entities: [__dirname + '/../entities/**.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*.js'],
  migrationsTableName: 'migrations',
  synchronize: true,
};
