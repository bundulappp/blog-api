import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDto } from '../models/dto/user.dto';
import { Repository } from 'typeorm';
import { UsersEntity } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserLoginView } from '../models/dto/user-login-request-view.model';
import { UpdateUserViewModel } from '../models/dto/update-user-view.model';
import { ChangePasswordViewModel } from '../models/change-password-view.model';
import { UserRelationshipEntity } from '../../entities/user-relationship.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthResultModel } from '../models/auth-result.model';
import { RefreshTokenEntity } from '../../entities/refresh-token.entity';
import { TokenRequestDto } from '../models/dto/token-request.dto';
import { JwtStrategy } from './jwtStrategy';
import { UserLoginResponseModel } from '../models/dto/user-login-response.model';
import { AccessTokenPayload } from '../models/acces-token.model';
import { RefreshTokenPayload } from '../models/refresh-token.model';
import { UserRole, UserRolesEntity } from 'src/entities/user-roles.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    @InjectRepository(UserRelationshipEntity)
    private userRelationshipRepository: Repository<UserRelationshipEntity>,
    @InjectRepository(RefreshTokenEntity)
    private refreshTokenRepository: Repository<RefreshTokenEntity>,
    @InjectRepository(UserRolesEntity)
    private userRoleRepository: Repository<UserRolesEntity>,
    private jwtService: JwtService,
    private jwtStrategy: JwtStrategy,
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
    newUser.createdAt = new Date();
    newUser.updatedAt = new Date();

    this.connectRegularUserWithRole(newUser);

    this.userRepository.save(newUser);
    return newUser;
  }

  connectRegularUserWithRole(user: UsersEntity): Promise<UserRolesEntity> {
    const userRole = new UserRolesEntity();
    userRole.role = UserRole.USER;
    userRole.description =
      'User has limited permissions, such as creating and updating their own blog posts and comments.';
    userRole.user = user;

    return this.userRoleRepository.save(userRole);
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

  async login(userDto: UserLoginView): Promise<UserLoginResponseModel> {
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

    const authResult = await this.createJwtPayload(user);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: authResult.accessToken,
      refreshToken: authResult.refreshToken,
    };
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

  async createJwtPayload(user: UserDto): Promise<AuthResultModel> {
    const accesTokenPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    const refreshTokenPayload = {
      id: user.id,
    };

    const accessToken = this.jwtService.sign(accesTokenPayload);
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: '7d',
    });

    this.refreshTokenRepository.save({
      token: refreshToken,
      user: user,
      isRevoked: false,
      isUsed: false,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken,
      refreshToken,
      success: true,
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
    if (decodedToken.id === +userId) {
      throw new ConflictException('Users are not able to follow themselves');
    }

    const user = await this.userRepository.findOne({
      where: { id: decodedToken.id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userToFollow = await this.userRepository.findOne({
      where: { id: +userId },
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

  async getFollowers(userId: number): Promise<UsersEntity[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const followers = await this.userRelationshipRepository
      .createQueryBuilder('relationship')
      .leftJoinAndSelect('relationship.follower', 'follower')
      .where('relationship.followedId = :userId', { userId: user.id })
      .getMany();

    const followerUsers = followers.map((follower) => follower.follower);

    return followerUsers;
  }

  async getFollowings(userId: number): Promise<UsersEntity[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const followings = await this.userRelationshipRepository
      .createQueryBuilder('relationship')
      .leftJoinAndSelect('relationship.followed', 'followed')
      .where('relationship.followerId = :userId', { userId: user.id })
      .getMany();

    const followingUsers = followings.map((following) => following.followed);

    return followingUsers;
  }

  async refreshToken(
    tokenRequestDto: TokenRequestDto,
  ): Promise<AuthResultModel> {
    if (!tokenRequestDto) {
      throw new BadRequestException('Token is required');
    }
    const decodedAccessToken: AccessTokenPayload = this.jwtService.verify(
      tokenRequestDto.accessToken,
    );

    const user = await this.userRepository.findOne({
      where: { id: decodedAccessToken.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const decodedRefreshToken: RefreshTokenPayload = this.jwtService.verify(
      tokenRequestDto.refreshToken,
    );
    const isValid = this.jwtStrategy.validate(
      decodedAccessToken,
      decodedRefreshToken,
    );

    if (!isValid) {
      throw new UnauthorizedException('User need to login again');
    }

    const authResult = this.createJwtPayload(user);

    return authResult;
  }
}
