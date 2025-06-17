import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTicketDto, TicketBaseDto } from './dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) { }

  async createTicket(dto: CreateTicketDto): Promise<TicketBaseDto> {
    // Ejecutar el procedimiento almacenado y capturar el mensaje de salida
    const [result] = await this.prisma.$queryRawUnsafe<any[]>(`
      CALL sp_ComprarTicket(${dto.user_id}, ${dto.showtime_id}, ${dto.seat_id}, @mensaje);
      SELECT @mensaje AS mensaje;
    `);

    const mensaje = result?.mensaje;

    // Validar mensaje de éxito o error
    if (!mensaje?.includes('éxito')) {
      throw new BadRequestException(mensaje);
    }

    // Si fue exitoso, buscar el ticket recién creado
    const data = await this.prisma.tickets.findFirst({
      where: {
        user_id: dto.user_id,
        showtime_id: dto.showtime_id,
        seat_id: dto.seat_id,
      },
    });

    if (!data) {
      throw new BadRequestException('Hubo un error');
    }

    const ticket: TicketBaseDto = {
      id: Number(data.id),
      user_id: Number(data.user_id),
      showtime_id: Number(data.showtime_id),
      seat_id: Number(data.seat_id),
      purchase_date: data.purchase_date
    };

    return plainToInstance(TicketBaseDto, ticket);
  }

  async getAllTickets(): Promise<TicketBaseDto[]> {
    const data = await this.prisma.tickets.findMany();

    const tickets: TicketBaseDto[] = data.map(ticket => ({
      id: Number(ticket.id),
      user_id: Number(ticket.user_id),
      showtime_id: Number(ticket.showtime_id),
      seat_id: Number(ticket.seat_id),
      purchase_date: ticket.purchase_date
    }));

    return tickets.map(ticket => plainToInstance(TicketBaseDto, ticket));
  }

  async getTicketById(id: number): Promise<TicketBaseDto> {
    const data = await this.prisma.tickets.findUnique({ where: { id } });
    if (!data) throw new NotFoundException(`Ticket ${id} not found`);

    const ticket: TicketBaseDto = {
      id: Number(data.id),
      user_id: Number(data.user_id),
      showtime_id: Number(data.showtime_id),
      seat_id: Number(data.seat_id),
      purchase_date: data.purchase_date
    };

    return plainToInstance(TicketBaseDto, ticket);
  }

  async getTicketsByUser(user_id: number): Promise<TicketBaseDto[]> {
    const data = await this.prisma.tickets.findMany({ where: { user_id } });

    const tickets: TicketBaseDto[] = data.map(ticket => ({
      id: Number(ticket.id),
      user_id: Number(ticket.user_id),
      showtime_id: Number(ticket.showtime_id),
      seat_id: Number(ticket.seat_id),
      purchase_date: ticket.purchase_date
    }));

    return tickets.map(ticket => plainToInstance(TicketBaseDto, ticket));
  }

  async getTicketsByShowtime(showtime_id: number): Promise<TicketBaseDto[]> {
    const data = await this.prisma.tickets.findMany({ where: { showtime_id } });

    const tickets: TicketBaseDto[] = data.map(ticket => ({
      id: Number(ticket.id),
      user_id: Number(ticket.user_id),
      showtime_id: Number(ticket.showtime_id),
      seat_id: Number(ticket.seat_id),
      purchase_date: ticket.purchase_date
    }));

    return tickets.map(ticket => plainToInstance(TicketBaseDto, ticket));
  }
}