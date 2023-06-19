import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import UsersRepository from './users.repository';

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {}

  create(createUserDto: UserDto): void {
    this.userRepository.createUser(createUserDto);
  }

  findAll() {
    return this.userRepository.getAllUsers();
  }

  findOne(id: number) {
    return this.userRepository.getUserById(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
