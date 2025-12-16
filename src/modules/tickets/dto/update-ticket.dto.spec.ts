import { validate } from 'class-validator';
import { UpdateTicketDto } from './update-ticket.dto';
import { UserBaseDto } from '../../users/dto/user-base.dto';
import { ShowtimeBaseDto } from '../../showtimes/dto/showtime-base.dto';
import { SeatBaseDto } from '../../seats/dto/seat-base.dto';

describe('UpdateTicketDto', () => {
  it('should be valid with correct data', async () => {
    const dto = new UpdateTicketDto();

    dto.user = new UserBaseDto();
    dto.user.id = 1;
    dto.user.first_name = 'John';
    dto.user.last_name = 'Doe';
    dto.user.email = 'jonhdoe@gmail.com';

    dto.showtime = new ShowtimeBaseDto();
    dto.showtime.id = 1;
    dto.showtime.start_time = new Date();
    dto.showtime.format = 'Standard';
    dto.showtime.price = 10;

    dto.seat = new SeatBaseDto();
    dto.seat.id = 1;
    dto.seat.row = 'A';
    dto.seat.seat_number = 5;

    dto.purchase_date = new Date();

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should be valid when empty (all fields optional)', async () => {
    const dto = new UpdateTicketDto();

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });
});
