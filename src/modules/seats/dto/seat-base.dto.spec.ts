import { validate } from 'class-validator';
import { SeatBaseDto } from './seat-base.dto';
import { RoomDto } from '../../rooms/dto/room.dto';

describe('SeatBaseDto', () => {
  it('should be valid with correct data', async () => {
    const dto = new SeatBaseDto();

    dto.id = 1;
    dto.room = new RoomDto();
    dto.room.id = 1;
    dto.room.name = 'Room A';
    dto.room.capacity = 50;
    dto.seat_number = 3;
    dto.row = 'C';
    dto.is_occupied = false;

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should be invalid if id is not present', async () => {
    const dto = new SeatBaseDto();

    dto.room = new RoomDto();
    dto.room.id = 1;
    dto.room.name = 'Room A';
    dto.room.capacity = 50;
    dto.seat_number = 3;
    dto.row = 'C';
    dto.is_occupied = false;

    const errors = await validate(dto);
    const idErrors = errors.find(error => error.property === 'id');

    expect(idErrors).toBeDefined();
  });
});
