import { validate } from 'class-validator';
import { CreateTicketDto } from './create-ticket.dto';

describe('CreateTicketDto', () => {
  it('should be valid with correct data', async () => {
    const dto = new CreateTicketDto();

    dto.user_id = 1;
    dto.showtime_id = 2;
    dto.seat_number = 5;
    dto.row = 'A';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should be invalid if seat_number is out of bounds', async () => {
    const dto = new CreateTicketDto();

    dto.user_id = 1;
    dto.showtime_id = 2;
    dto.seat_number = 11;
    dto.row = 'A';

    const errors = await validate(dto);
    const seatNumberErrors = errors.find(error => error.property === 'seat_number');

    expect(seatNumberErrors).toBeDefined();
    expect(seatNumberErrors?.constraints).toHaveProperty('max');
  });
});
