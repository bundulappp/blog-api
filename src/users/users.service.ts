import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { Repository } from 'typeorm';
import { UsersEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY') private userRepository: Repository<UsersEntity>,
  ) {}

  async create(createUserDto: UserDto): Promise<UsersEntity> {
    const userWithSameEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (userWithSameEmail) {
      throw new ConflictException('User already exists with this email');
    }

    const userWithSameUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (userWithSameUsername) {
      throw new ConflictException('User already exists with this username');
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUserDto.password, salt);

    const newUser = this.userRepository.create(createUserDto);
    newUser.password = hash;

    this.userRepository.save(newUser);
    return newUser;
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<UsersEntity> {
    return this.userRepository.findOne({ where: { id } });
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
