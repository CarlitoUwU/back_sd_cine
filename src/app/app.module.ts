import { Module } from '@nestjs/common';
import { UsersModule } from '../modules/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from '../modules/movies/movies.module';
import { RoomsModule } from '../modules/rooms/rooms.module';
import { ShowtimesModule } from '../modules/showtimes/showtimes.module';
import { SeatsModule } from '../modules/seats/seats.module';
import { TicketsModule } from '../modules/tickets/tickets.module';
import { CommonModule } from '../common/common.module';
import { MailsModule } from '../modules/mails/mails.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    MoviesModule,
    RoomsModule,
    ShowtimesModule,
    SeatsModule,
    TicketsModule,
    CommonModule,
    MailsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
