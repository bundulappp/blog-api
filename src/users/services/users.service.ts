import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserDto } from '../models/dto/user.dto';
import { Repository } from 'typeorm';
import { UsersEntity } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserLoginView } from '../models/dto/user-login-view.model';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY') private userRepository: Repository<UsersEntity>,
    private jwtService: JwtService,
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
    //const isMatch = await bcrypt.compare(password, hash);
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
  //todo: make find one by email and username
  async findOneById(id: number): Promise<UsersEntity> {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findOneByUsername(username: string): Promise<UsersEntity> {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async login(userDto: UserLoginView): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { username: userDto.username },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(userDto.password, user.password);

    if (!isMatch) {
      throw new NotFoundException('Password is incorrect');
    }

    const payload = this.createJwtPayload(user);

    return payload;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // async disable(id: number): Promise<void> {
  //   const user = await this.findOne(id);
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }
  //   this.userRepository.update(id, { isActive: false });
  // }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.findOneByUsername(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async createJwtPayload(user: UserDto) {
    const payload = {
      username: user.username,
      email: user.email,
      isActive: user.isActive,
      isVerified: user.isVerified,
      id: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
