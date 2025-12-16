import { validate } from 'class-validator';
import { TicketBaseDto } from './ticket-base.dto';
import { UserBaseDto } from '../../users/dto/user-base.dto';
import { ShowtimeBaseDto } from '../../showtimes/dto/showtime-base.dto';
import { SeatBaseDto } from '../../seats/dto/seat-base.dto';

describe('TicketBaseDto', () => {
  it('should be valid with correct data', async () => {
    const dto = new TicketBaseDto();

    dto.id = 1;

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

  it('should be invalid if id is missing', async () => {
    const dto = new TicketBaseDto();

    dto.user = new UserBaseDto();
    dto.user.id = 1;
    dto.user.first_name = 'John';
    dto.user.last_name = 'Doe';
    dto.user.email = 'a@b.com';

    const errors = await validate(dto);
    const idErrors = errors.find(error => error.property === 'id');

    expect(idErrors).toBeDefined();
  });
});
