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
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<UserDto[]> {
    return this.usersService.findAll();
  }

  @Get(':userId')
  findOne(@Param('userId') id: string): Promise<UserDto> {
    return this.usersService.findOneById(+id);
  }

  @Post('login')
  login(@Body() userData: UserLoginView): Promise<UserLoginResponseModel> {
    return this.usersService.login(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Put('deactive')
  update(@Request() req) {
    return this.usersService.disable(req);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  updateById(@Request() req, @Body() updateUserDto: UserUpdateDto) {
    return this.usersService.update(req, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  changePassword(@Request() req, @Body() userData: ChangePasswordViewModel) {
    return this.usersService.changePassword(req, userData);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':userId/follow')
  followUser(@Request() req, @Param('userId') userId: number) {
    return this.usersService.followUser(req, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userId/unfollow')
  unfollowUser(@Request() req, @Param('userId') userId: number) {
    return this.usersService.unfollowUser(req, userId);
  }

  @Get('/:userId/followers')
  getFollowers(@Param('userId') userId: number) {
    return this.usersService.getFollowers(+userId);
  }

  @Get('/:userId/followings')
  getFollowings(@Param('userId') userId: number) {
    return this.usersService.getFollowings(+userId);
  }

  @Post('refresh-token')
  refreshToken(@Body() tokenRequestDto: TokenRequestDto) {
    return this.usersService.refreshToken(tokenRequestDto);
  }
}
