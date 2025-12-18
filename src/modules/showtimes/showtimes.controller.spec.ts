import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { ShowtimesController } from './showtimes.controller';
import { PrismaService } from 'src/prisma.service';
import { ShowtimeBaseDto } from './dto/showtime-base.dto';

const dto: CreateShowtimeDto = {
  movie_id: 1,
  room_id: 2,
  start_time: new Date('2025-12-17T10:00:00Z'),
  format: 'IMAX',
  price: 10.5,
};

const response: ShowtimeBaseDto = {
  id: 1,
  movie: { id: 1, title: 'Inception', duration: 148, description: undefined, url_poster: undefined, url_background: undefined, url_trailer: undefined, genre: undefined, rating: undefined },
  room: { id: 2, name: 'Room A', capacity: 50 },
  start_time: new Date('2025-12-17T10:00:00Z'),
  format: 'IMAX',
  price: 10.5,
};

describe('ShowtimesController', () => {
  let controller: ShowtimesController;
  let service: ShowtimesService;

  const prismaMock = {
    showtimes: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowtimesController],
      providers: [
        ShowtimesService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    controller = module.get<ShowtimesController>(ShowtimesController);
    service = module.get<ShowtimesService>(ShowtimesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call ShowtimesService.createShowtime', async () => {
    jest.spyOn(service, 'createShowtime').mockResolvedValue(response);

    const result = await controller.create(dto);

    expect(service.createShowtime).toHaveBeenCalledWith(dto);
    expect(result).toEqual(response);
  });

  it('should call ShowtimesService.getShowtimes', async () => {
    jest.spyOn(service, 'getShowtimes').mockResolvedValue([response]);

    const result = await controller.getAll();

    expect(service.getShowtimes).toHaveBeenCalled();
    expect(result).toEqual([response]);
  });

  it('should call ShowtimesService.getShowtimeById', async () => {
    jest.spyOn(service, 'getShowtimeById').mockResolvedValue(response);

    const result = await controller.getById(1);

    expect(service.getShowtimeById).toHaveBeenCalledWith(1);
    expect(result).toEqual(response);
  });

  it('should call ShowtimesService.updateShowtime', async () => {
    jest.spyOn(service, 'updateShowtime').mockResolvedValue(response);

    const result = await controller.update(1, dto);

    expect(service.updateShowtime).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual(response);
  });

  it('should call ShowtimesService.deleteShowtime', async () => {
    jest.spyOn(service, 'deleteShowtime').mockResolvedValue(response);

    const result = await controller.delete(1);

    expect(service.deleteShowtime).toHaveBeenCalledWith(1);
    expect(result).toEqual(response);
  });

  it('should call ShowtimesService.getShowtimesByMovieId', async () => {
    jest.spyOn(service, 'getShowtimesByMovieId').mockResolvedValue([response]);

    const result = await controller.getShowtimesByMovieId(1);

    expect(service.getShowtimesByMovieId).toHaveBeenCalledWith(1);
    expect(result).toEqual([response]);
  });
});
