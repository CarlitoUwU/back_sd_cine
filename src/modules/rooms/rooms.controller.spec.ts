import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomsController } from './rooms.controller';
import { PrismaService } from 'src/prisma.service';
import { RoomBaseDto } from './dto/room-base.dto';

const dto: CreateRoomDto = {
  name: 'Room A',
  capacity: 50,
};

const response: RoomBaseDto = {
  id: 1,
  name: 'Room A',
  capacity: 50,
};

describe('RoomsController', () => {
  let controller: RoomsController;
  let service: RoomsService;

  const prismaMock = {
    rooms: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    seats: {
      createMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [
        RoomsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    controller = module.get<RoomsController>(RoomsController);
    service = module.get<RoomsService>(RoomsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call RoomsService.createRoom', async () => {
    jest.spyOn(service, 'createRoom').mockResolvedValue(response);

    const result = await controller.create(dto);

    expect(service.createRoom).toHaveBeenCalledWith(dto);
    expect(result).toEqual(response);
  });

  it('should call RoomsService.getRooms', async () => {
    jest.spyOn(service, 'getRooms').mockResolvedValue([response]);

    const result = await controller.getAll();

    expect(service.getRooms).toHaveBeenCalled();
    expect(result).toEqual([response]);
  });

  it('should call RoomsService.getRoomById', async () => {
    jest.spyOn(service, 'getRoomById').mockResolvedValue(response);

    const result = await controller.getById(1);

    expect(service.getRoomById).toHaveBeenCalledWith(1);
    expect(result).toEqual(response);
  });

  it('should call RoomsService.updateRoom', async () => {
    jest.spyOn(service, 'updateRoom').mockResolvedValue(response);

    const result = await controller.update(1, dto);

    expect(service.updateRoom).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual(response);
  });

  it('should call RoomsService.deleteRoom', async () => {
    jest.spyOn(service, 'deleteRoom').mockResolvedValue(response);

    const result = await controller.delete(1);

    expect(service.deleteRoom).toHaveBeenCalledWith(1);
    expect(result).toEqual(response);
  });
});
