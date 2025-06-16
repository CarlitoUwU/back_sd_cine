import { Controller, Get } from '@nestjs/common';
import { UsersServices } from './users.service';

@Controller('users')
export class UsersController {

  constructor(private usersService: UsersServices) { }

  @Get('/')
  getAllUsers() {
    return this.usersService.getUsers();
  }
}