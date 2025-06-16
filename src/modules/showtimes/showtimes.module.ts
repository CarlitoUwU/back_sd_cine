import { Module } from '@nestjs/common';
import { ShowtimesController } from './showtimes.controller';

@Module({
  controllers: [ShowtimesController]
})
export class ShowtimesModule {}
