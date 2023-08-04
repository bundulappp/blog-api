import { UserRole, UserRolesEntity } from 'src/entities/user-roles.entity';
import { UsersEntity } from 'src/entities/user.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

export class SeedUserRolesTable1691130904239 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(process.env.ADMIN_PSWD, salt);

    const admin = new UsersEntity();
    admin.username = 'admin';
    admin.password = hash;
    admin.email = process.env.ADMIN_EMAIL;
    admin.isActive = true;
    admin.isVerified = true;
    admin.createdAt = new Date();
    admin.updatedAt = new Date();

    const adminRole = new UserRolesEntity();
    adminRole.role = UserRole.ADMIN;
    adminRole.description = 'Full control over the application';
    adminRole.user = admin;

    await queryRunner.manager.save(admin);
    await queryRunner.manager.save(adminRole);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const adminRole = await queryRunner.manager.findOne(UserRolesEntity, {
      where: { role: UserRole.ADMIN },
    });
    if (adminRole) {
      await queryRunner.manager.remove(adminRole);
    }

    // Then, delete the admin user itself
    const admin = await queryRunner.manager.findOne(UsersEntity, {
      where: { username: 'admin' },
    });
    if (admin) {
      await queryRunner.manager.remove(admin);
    }
  }
}
