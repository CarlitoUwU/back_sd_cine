import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersServices } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersServices],
})
export class UsersModule {}