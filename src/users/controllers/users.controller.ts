import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UnprocessableEntityException,
  NotFoundException,
  Put,
  UseGuards,
  Delete,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserDto } from '../models/dto/user.dto';
import { UserLoginView } from '../models/dto/user-login-request-view.model';
import { JwtAuthGuard } from '../services/authGuard';
import { ChangePasswordViewModel } from '../models/change-password-view.model';
import { UserLoginResponseModel } from '../models/dto/user-login-response.model';
import { TokenRequestDto } from '../models/dto/token-request.dto';
import { UserUpdateDto } from '../models/dto/user-update.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  create(@Body() createUserDto: UserDto) {
    try {
      return this.usersService.create(createUserDto);
    } catch (error) {
      throw new UnprocessableEntityException(error.errmsg);
    }
  }

  @Get()
  findAll(): Promise<UserDto[]> {
    try {
      return this.usersService.findAll();
    } catch (error) {
      throw new NotFoundException('Users not found');
    }
  }

  @Get(':userId')
  findOne(@Param('userId') id: string): Promise<UserDto> {
    try {
      return this.usersService.findOneById(+id);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  @Post('login')
  login(@Body() userData: UserLoginView): Promise<UserLoginResponseModel> {
    try {
      return this.usersService.login(userData);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('deactive')
  update(@Request() req) {
    try {
      return this.usersService.disable(req);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  updateById(@Request() req, @Body() updateUserDto: UserUpdateDto) {
    try {
      return this.usersService.update(req, updateUserDto);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  changePassword(@Request() req, @Body() userData: ChangePasswordViewModel) {
    try {
      return this.usersService.changePassword(req, userData);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':userId/follow')
  followUser(@Request() req, @Param('userId') userId: number) {
    try {
      return this.usersService.followUser(req, userId);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userId/unfollow')
  unfollowUser(@Request() req, @Param('userId') userId: number) {
    try {
      return this.usersService.unfollowUser(req, userId);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  @Get('/:userId/followers')
  getFollowers(@Param('userId') userId: number) {
    try {
      return this.usersService.getFollowers(+userId);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  @Get('/:userId/followings')
  getFollowings(@Param('userId') userId: number) {
    try {
      return this.usersService.getFollowings(+userId);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  @Post('refresh-token')
  refreshToken(@Body() tokenRequestDto: TokenRequestDto) {
    try {
      return this.usersService.refreshToken(tokenRequestDto);
    } catch (error) {
      throw new UnauthorizedException('User need to login again');
    }
  }
}
