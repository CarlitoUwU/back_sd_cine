import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {

  @Get('/')
  getAllUsers() {
    return 'Obteniendo todos los usuarios';
  }
}