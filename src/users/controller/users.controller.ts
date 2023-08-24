import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserDto } from '../models/dto/user.dto';
import { UserLoginView } from '../models/dto/user-login-request-view.model';
import { JwtAuthGuard } from '../../shared/guards/authGuard';
import { ChangePasswordViewModel } from '../models/change-password-view.model';
import { UserLoginResponseModel } from '../models/dto/user-login-response.model';
import { TokenRequestDto } from '../models/dto/token-request.dto';
import { UserUpdateDto } from '../models/dto/user-update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotoUploadDto } from 'src/photos/models/photo-upload.dto';
import { PhotosService } from 'src/photos/services/photos.service';
import { User } from '../decorator/user.decorator';
import { getStorageConfig } from 'src/utilities/storageCongif';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly photoService: PhotosService,
  ) {}

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
  update(@User() userToken) {
    return this.usersService.disable(userToken);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  updateById(@User() userToken, @Body() updateUserDto: UserUpdateDto) {
    return this.usersService.update(userToken, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  changePassword(@User() userToken, @Body() userData: ChangePasswordViewModel) {
    return this.usersService.changePassword(userToken, userData);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':userId/follow')
  followUser(@User() userToken, @Param('userId') userId: number) {
    return this.usersService.followUser(userToken, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userId/unfollow')
  unfollowUser(@User() userToken, @Param('userId') userId: number) {
    return this.usersService.unfollowUser(userToken, userId);
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

  @UseGuards(JwtAuthGuard)
  @Post('/profile-image/upload')
  @UseInterceptors(
    FileInterceptor('image', getStorageConfig('./uploads/profile-images')),
  )
  async uploadSingle(@UploadedFile() file: PhotoUploadDto, @User() userToken) {
    return this.photoService.uploadSingle(file, userToken);
  }
}
