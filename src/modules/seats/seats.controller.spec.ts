import { Test, TestingModule } from '@nestjs/testing';
import { SeatsService } from './seats.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { SeatsController } from './seats.controller';
import { PrismaService } from 'src/prisma.service';
import { SeatBaseDto } from './dto/seat-base.dto';

const dto: CreateSeatDto = {
  seat_number: 5,
  row: 'A',
  room_id: 1,
};

const response: SeatBaseDto = {
  id: 1,
  seat_number: 5,
  row: 'A',
  is_occupied: false,
  room: { id: 1, name: 'Room A', capacity: 50 },
};

describe('SeatsController', () => {
  let controller: SeatsController;
  let service: SeatsService;

  const prismaMock = {
    seats: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn(),
    },
    rooms: { findUnique: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeatsController],
      providers: [
        SeatsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    controller = module.get<SeatsController>(SeatsController);
    service = module.get<SeatsService>(SeatsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call SeatsService.createSeat', async () => {
    jest.spyOn(service, 'createSeat').mockResolvedValue(response);

    const result = await controller.create(dto);

    expect(service.createSeat).toHaveBeenCalledWith(dto);
    expect(result).toEqual(response);
  });

  it('should call SeatsService.getSeats', async () => {
    jest.spyOn(service, 'getSeats').mockResolvedValue([response]);

    const result = await controller.getAll();

    expect(service.getSeats).toHaveBeenCalled();
    expect(result).toEqual([response]);
  });

  it('should call SeatsService.getSeatById', async () => {
    jest.spyOn(service, 'getSeatById').mockResolvedValue(response);

    const result = await controller.getById(1);

    expect(service.getSeatById).toHaveBeenCalledWith(1);
    expect(result).toEqual(response);
  });

  it('should call SeatsService.updateSeat', async () => {
    jest.spyOn(service, 'updateSeat').mockResolvedValue(response);

    const result = await controller.update(1, dto);

    expect(service.updateSeat).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual(response);
  });

  it('should call SeatsService.deleteSeat', async () => {
    jest.spyOn(service, 'deleteSeat').mockResolvedValue(response);

    const result = await controller.delete(1);

    expect(service.deleteSeat).toHaveBeenCalledWith(1);
    expect(result).toEqual(response);
  });

  it('should call SeatsService.occupySeat', async () => {
    jest.spyOn(service, 'occupySeat').mockResolvedValue(response);

    const result = await controller.occupy(1);

    expect(service.occupySeat).toHaveBeenCalledWith(1);
    expect(result).toEqual(response);
  });

  it('should call SeatsService.freeSeat', async () => {
    jest.spyOn(service, 'freeSeat').mockResolvedValue(response);

    const result = await controller.free(1);

    expect(service.freeSeat).toHaveBeenCalledWith(1);
    expect(result).toEqual(response);
  });
});
