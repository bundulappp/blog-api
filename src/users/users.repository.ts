import { EntityRepository, Repository } from 'typeorm';
import { UsersEntity } from './entities/user.entity';
import { UserDto } from './dto/user.dto';

@EntityRepository(UsersEntity)
export class UsersRepository extends Repository<UsersEntity> {
  async createUser(dto: UserDto): Promise<void> {
    const newUser: UsersEntity = new UsersEntity({
      email: dto.email,
      username: dto.username,
      password: dto.password,
    });

    await this.save(newUser);
  }

  async getUserByEmail(email: string): Promise<UsersEntity> {
    return await this.findOne({ where: { email } });
  }

  async getUserById(id: number): Promise<UsersEntity> {
    return await this.findOne({ where: { id } });
  }

  async updateUser(id: number, dto: UserDto): Promise<void> {
    //oAuth todo
  }
}

export default UsersRepository;
