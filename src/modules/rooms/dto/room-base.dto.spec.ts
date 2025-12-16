import { validate } from 'class-validator';
import { RoomBaseDto } from './room-base.dto';

describe('RoomBaseDto', () => {
  it('should be valid with correct data', async () => {
    const dto = new RoomBaseDto();

    dto.id = 1;
    dto.name = 'Room A';
    dto.capacity = 50;

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should be invalid if id is not present', async () => {
    const dto = new RoomBaseDto();

    dto.name = 'Room A';
    dto.capacity = 50;

    const errors = await validate(dto);
    const idErrors = errors.find(error => error.property === 'id');

    expect(idErrors).toBeDefined();
  });
});
