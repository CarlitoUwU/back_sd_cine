import { validate } from 'class-validator';
import { UpdateRoomDto } from './update-room.dto';

describe('UpdateRoomDto', () => {
  it('should be valid when empty (all fields optional)', async () => {
    const dto = new UpdateRoomDto();

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should validate provided name when present (min length)', async () => {
    const dto = new UpdateRoomDto();

    dto.name = '';

    const errors = await validate(dto);
    const nameErrors = errors.find(error => error.property === 'name');

    expect(nameErrors).toBeDefined();
  });

  it('should validate provided capacity when present (min 1)', async () => {
    const dto = new UpdateRoomDto();

    dto.capacity = 0;

    const errors = await validate(dto);
    const capacityErrors = errors.find(error => error.property === 'capacity');

    expect(capacityErrors).toBeDefined();
    expect(capacityErrors?.constraints).toHaveProperty('min');
  });
});
