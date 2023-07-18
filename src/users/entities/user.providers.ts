// import { DataSource } from 'typeorm';
// import { UsersEntity } from './user.entity';
// import { UserRelationshipEntity } from './user-relationship.entity';

// export const userProviders = [
//   {
//     provide: 'USER_REPOSITORY',
//     useFactory: (dataSource: DataSource) =>
//       dataSource.getRepository(UsersEntity),
//     inject: ['DATA_SOURCE'],
//   },
//   {
//     provide: 'USER_RELATIONSHIP_REPOSITORY',
//     useFactory: (dataSource: DataSource) =>
//       dataSource.getRepository(UserRelationshipEntity),
//     inject: ['DATA_SOURCE'],
//   },
// ];
