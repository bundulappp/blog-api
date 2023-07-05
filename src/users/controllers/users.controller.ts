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
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserDto } from '../models/dto/user.dto';
import { UserLoginView } from '../models/dto/user-login-view.model';
import { JwtAuthGuard } from '../services/authGuard';

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
  findAll() {
    try {
      return this.usersService.findAll();
    } catch (error) {
      throw new NotFoundException('Users not found');
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.usersService.findOneById(+id);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  @Post('login')
  login(@Body() userData: UserLoginView): Promise<any> {
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
  @Put(':id')
  updateById(@Param('id') id: string, @Body() updateUserDto: UserDto) {
    try {
      return this.usersService.update(+id, updateUserDto);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
