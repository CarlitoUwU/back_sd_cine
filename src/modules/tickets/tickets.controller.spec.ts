import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketsController } from './tickets.controller';
import { PrismaService } from 'src/prisma.service';
import { TicketBaseDto } from './dto/ticket-base.dto';

const dto: CreateTicketDto = {
  user_id: 1,
  showtime_id: 1,
  row: 'A',
  seat_number: 5,
};

const sampleTicket: TicketBaseDto = {
  id: 1,
  user: { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
  showtime: {
    id: 1,
    start_time: new Date('2025-12-17T10:00:00Z'),
    format: 'IMAX',
    price: 10.5,
    movie: { id: 1, title: 'Inception', duration: 148, description: undefined, url_poster: undefined, url_background: undefined, url_trailer: undefined, genre: undefined, rating: undefined },
    room: { id: 2, name: 'Room A', capacity: 50 },
  },
  seat: { id: 1, seat_number: 5, row: 'A', is_occupied: false, room: { id: 2, name: 'Room A', capacity: 50 } },
  purchase_date: new Date('2025-12-17T10:01:00Z'),
};

describe('TicketsController', () => {
  let controller: TicketsController;
  let service: TicketsService;

  const prismaMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [
        TicketsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    controller = module.get<TicketsController>(TicketsController);
    service = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call TicketsService.createTicket', async () => {
    jest.spyOn(service, 'createTicket').mockResolvedValue(sampleTicket);

    const result = await controller.create(dto);

    expect(service.createTicket).toHaveBeenCalledWith(dto);
    expect(result).toEqual(sampleTicket);
  });

  it('should call TicketsService.createMultipleTickets', async () => {
    jest.spyOn(service, 'createMultipleTickets').mockResolvedValue([sampleTicket]);

    const result = await controller.createMultiple([dto]);

    expect(service.createMultipleTickets).toHaveBeenCalledWith([dto]);
    expect(result).toEqual([sampleTicket]);
  });

  it('should call TicketsService.getAllTickets', async () => {
    jest.spyOn(service, 'getAllTickets').mockResolvedValue([sampleTicket]);

    const result = await controller.findAll();

    expect(service.getAllTickets).toHaveBeenCalled();
    expect(result).toEqual([sampleTicket]);
  });

  it('should call TicketsService.getTicketById', async () => {
    jest.spyOn(service, 'getTicketById').mockResolvedValue(sampleTicket);

    const result = await controller.findOne(1);

    expect(service.getTicketById).toHaveBeenCalledWith(1);
    expect(result).toEqual(sampleTicket);
  });

  it('should call TicketsService.getTicketsByUser', async () => {
    jest.spyOn(service, 'getTicketsByUser').mockResolvedValue([sampleTicket]);

    const result = await controller.findByUser(1);

    expect(service.getTicketsByUser).toHaveBeenCalledWith(1);
    expect(result).toEqual([sampleTicket]);
  });

  it('should call TicketsService.getTicketsByShowtime', async () => {
    jest.spyOn(service, 'getTicketsByShowtime').mockResolvedValue([sampleTicket]);

    const result = await controller.findByShowtime(1);

    expect(service.getTicketsByShowtime).toHaveBeenCalledWith(1);
    expect(result).toEqual([sampleTicket]);
  });
});
