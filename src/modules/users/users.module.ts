import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersServices } from './users.service';
import { PrismaService } from 'src/prisma.service';
import { MailsModule } from '../mails/mails.module';

@Module({
  imports: [MailsModule],
  controllers: [UsersController],
  providers: [UsersServices, PrismaService],
})
export class UsersModule { }