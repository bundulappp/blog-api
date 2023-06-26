import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UnprocessableEntityException,
  NotFoundException,
  Delete,
  Put,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserDto } from '../models/dto/user.dto';
import { UserLoginView } from '../models/dto/user-login-view.model';

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

  //create a login method
  @Post('login')
  login(@Body() userData: UserLoginView): Promise<any> {
    try {
      return this.usersService.login(userData);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
