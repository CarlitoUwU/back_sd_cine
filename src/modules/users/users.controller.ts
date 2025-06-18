import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { UsersServices } from './users.service';
import { CreateUserDto, LoginDto, UserBaseDto } from './dto/index';
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';

@Controller('users')
export class UsersController {

  constructor(private usersService: UsersServices) { }

  @ApiTags('Users')
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Returns all users',
    type: UserBaseDto,
    isArray: true,
  })
  getAllUsers() {
    return this.usersService.getUsers();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserBaseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserBaseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid user data' })
  createUser(@Body() user: CreateUserDto) {
    return this.usersService.createUser(user);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserBaseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Invalid data for update' })
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: CreateUserDto) {
    return this.usersService.updateUser(id, user);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    type: UserBaseDto
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }

  @Post('/login')
  @Post('/login')
  @ApiOperation({ summary: 'User login', description: 'Authenticates a user with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User authenticated', type: UserBaseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @HttpCode(200) 
  login(@Body() user: LoginDto) {
    return this.usersService.login(user.email, user.password);
  }
}