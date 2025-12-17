import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from 'src/modules/users/users.module';
import { MoviesModule } from 'src/modules/movies/movies.module';
import { RoomsModule } from 'src/modules/rooms/rooms.module';
import { ShowtimesModule } from 'src/modules/showtimes/showtimes.module';
import { SeatsModule } from 'src/modules/seats/seats.module';
import { TicketsModule } from 'src/modules/tickets/tickets.module';
import { CommonModule } from 'src/common/common.module';
import { MailsModule } from 'src/modules/mails/mails.module';
import { AppModule } from './app.module';

describe('AppModule', () => {
  let appController: AppController;
  let appService: AppService;

  let usersModule: UsersModule;
  let moviesModule: MoviesModule;
  let roomsModule: RoomsModule;
  let showtimesModule: ShowtimesModule;
  let seatsModule: SeatsModule;
  let ticketsModule: TicketsModule;
  let commonModule: CommonModule;
  let mailsModule: MailsModule;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule
      ],
    }).compile();

    appController = moduleRef.get<AppController>(AppController);
    appService = moduleRef.get<AppService>(AppService);

    usersModule = moduleRef.get<UsersModule>(UsersModule);
    moviesModule = moduleRef.get<MoviesModule>(MoviesModule);
    roomsModule = moduleRef.get<RoomsModule>(RoomsModule);
    showtimesModule = moduleRef.get<ShowtimesModule>(ShowtimesModule);
    seatsModule = moduleRef.get<SeatsModule>(SeatsModule);
    ticketsModule = moduleRef.get<TicketsModule>(TicketsModule);
    commonModule = moduleRef.get<CommonModule>(CommonModule);
    mailsModule = moduleRef.get<MailsModule>(MailsModule);
  });

  it('should be defined with proper elements', () => {
    expect(appController).toBeDefined();
    expect(appService).toBeDefined();

    expect(usersModule).toBeDefined();
    expect(moviesModule).toBeDefined();
    expect(roomsModule).toBeDefined();
    expect(showtimesModule).toBeDefined();
    expect(seatsModule).toBeDefined();
    expect(ticketsModule).toBeDefined();
    expect(commonModule).toBeDefined();
    expect(mailsModule).toBeDefined();
  });
});
