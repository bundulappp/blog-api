import { UsersEntity } from 'src/users/entities/user.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUserTable1689311815477 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const admin = new UsersEntity();
    admin.username = 'admin';
    admin.email = 'admin@blog.eu';
    admin.password = process.env.ADMIN_SECRET;
    admin.isActive = true;
    admin.isVerified = true;

    const moderator = new UsersEntity();
    moderator.username = 'moderato';
    moderator.email = 'moderator@blog.eu';
    moderator.password = process.env.MODERATOR_SECRET;
    moderator.isActive = true;
    moderator.isVerified = true;

    await queryRunner.manager.save(admin);
    await queryRunner.manager.save(moderator);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
