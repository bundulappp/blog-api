import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDto } from '../models/dto/user.dto';
import { Repository } from 'typeorm';
import { UsersEntity } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserLoginView } from '../models/dto/user-login-request-view.model';
import { UpdateUserViewModel } from '../models/dto/update-user-view.model';
import { ChangePasswordViewModel } from '../models/change-password-view.model';
import { UserRelationshipEntity } from '../entities/user-relationship.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY') private userRepository: Repository<UsersEntity>,
    @Inject('USER_RELATIONSHIP_REPOSITORY')
    private userRelationshipRepository: Repository<UserRelationshipEntity>,
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
    //date in the format of 2023-03-27 21:00:02, it is Date type
    newUser.createdAt = new Date();
    newUser.updatedAt = new Date();

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

  async disable(request: any): Promise<void> {
    const token = request.headers.authorization.split(' ')[1];
    const isVerified = this.jwtService.verify(token);

    if (!isVerified) {
      throw new UnauthorizedException('User not verified');
    }
    const user = this.userRepository.findOne({ where: { id: isVerified.id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.userRepository.update(isVerified.id, { isActive: false });
  }

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

  async update(req: any, updateUserDto: UpdateUserViewModel): Promise<number> {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = this.jwtService.verify(token);
    if (!decodedToken || !decodedToken.id) {
      throw new NotFoundException('User not found');
    }

    const user = await this.userRepository.findOne({
      where: { id: decodedToken.id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.updatedAt = new Date();

    const updatedUser = await this.userRepository.save({
      ...user,
      ...updateUserDto,
    });

    return updatedUser.id;
  }

  async changePassword(
    req: any,
    passwordData: ChangePasswordViewModel,
  ): Promise<void> {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = this.jwtService.verify(token);
    if (!decodedToken || !decodedToken.id) {
      throw new NotFoundException('User not found');
    }

    const user = await this.userRepository.findOne({
      where: { id: decodedToken.id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(
      passwordData.currentPassword,
      user.password,
    );

    if (!isMatch) {
      throw new NotFoundException('Password is incorrect');
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(passwordData.newPassword, salt);

    user.password = hash;
    user.updatedAt = new Date();

    await this.userRepository.save(user);
  }

  async followUser(req: any, userId: number): Promise<void> {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = this.jwtService.verify(token);

    if (!decodedToken || !decodedToken.id) {
      throw new NotFoundException('User not found');
    }

    const user = await this.userRepository.findOne({
      where: { id: decodedToken.id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userToFollow = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!userToFollow) {
      throw new NotFoundException('User not found');
    }

    const isAlreadyFollowing = await this.userRelationshipRepository.findOne({
      where: { followerId: user.id, followedId: userToFollow.id },
    });

    if (isAlreadyFollowing) {
      throw new ConflictException('User is already following');
    }

    const userRelationshipData = {
      followerId: user.id,
      followedId: userToFollow.id,
      createdAt: new Date(),
    };

    const userRelationshipEntity = await this.userRelationshipRepository.create(
      userRelationshipData,
    );

    this.userRelationshipRepository.save(userRelationshipEntity);
  }

  async unfollowUser(req: any, userId: number): Promise<void> {
    console.log(req);
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = this.jwtService.verify(token);

    if (!decodedToken || !decodedToken.id) {
      throw new NotFoundException('User not found');
    }

    const user = await this.userRepository.findOne({
      where: { id: decodedToken.id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userToUnfollow = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!userToUnfollow) {
      throw new NotFoundException('User not found');
    }

    const isAlreadyFollowing = await this.userRelationshipRepository.findOne({
      where: { followerId: user.id, followedId: userToUnfollow.id },
    });

    if (!isAlreadyFollowing) {
      throw new ConflictException('User is not following');
    }

    await this.userRelationshipRepository.delete(isAlreadyFollowing.id);
  }
}
