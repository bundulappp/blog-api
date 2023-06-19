import { EntityRepository, Repository } from 'typeorm';
import { UsersEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UnprocessableEntityException } from '@nestjs/common';

@EntityRepository(UsersEntity)
export class UsersRepository extends Repository<UsersEntity> {
  async createUser(dto: CreateUserDto): Promise<void> {
    const newUser: UsersEntity = new UsersEntity({
      email: dto.email,
      username: dto.username,
      password: dto.password,
    });
    try {
      await this.save(newUser);
    } catch (error) {
      throw new UnprocessableEntityException(error.errmsg);
    }
  }
}

export default UsersRepository;
