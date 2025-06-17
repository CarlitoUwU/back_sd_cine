import { Module } from '@nestjs/common';
import { SeatsController } from './seats.controller';
import { SeatsService } from './seats.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SeatsController],
  providers: [SeatsService, PrismaService]
})
export class SeatsModule {}
