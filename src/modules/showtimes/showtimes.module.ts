import { Module } from '@nestjs/common';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ShowtimesController],
  providers: [ShowtimesService, PrismaService]
})
export class ShowtimesModule { }
