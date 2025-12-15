import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTicketDto, TicketBaseDto } from './dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) { }

  async createTicket(dto: CreateTicketDto): Promise<TicketBaseDto> {
    const result = await this.prisma.$queryRaw<
      { mensaje: string }[]
    >`
      SELECT comprar_ticket(
        ${dto.user_id}::bigint,
        ${dto.showtime_id}::bigint,
        ${dto.row}::varchar,
        ${dto.seat_number}::int
      ) AS mensaje
    `;

    const mensaje = result[0]?.mensaje;

    if (!mensaje || !mensaje.includes('éxito')) {
      throw new BadRequestException(mensaje ?? 'Error al comprar ticket');
    }

    const showtime = await this.prisma.showtimes.findUnique({
      where: { id: dto.showtime_id },
      select: { room_id: true },
    });

    if (!showtime) {
      throw new Error('Showtime no existe');
    }

    const data = await this.prisma.tickets.findFirst({
      where: {
        user_id: dto.user_id,
        showtime_id: dto.showtime_id,
        seat: {
          row: dto.row,
          seat_number: dto.seat_number,
          room_id: showtime.room_id,
        },
      },
      include: {
        user: true,
        showtime: {
          include: {
            movie: true,
            room: true,
          },
        },
        seat: true,
      },
    });

    if (!data) {
      throw new Error('Ticket no encontrado después de la compra');
    }

    return this.toTicketDto(data);
  }

  async createMultipleTickets(dtos: CreateTicketDto[]): Promise<TicketBaseDto[]> {
    return await this.prisma.$transaction(async (tx) => {
      const tickets: TicketBaseDto[] = [];

      for (const dto of dtos) {
        const result = await tx.$queryRaw<
          { mensaje: string }[]
        >`
        SELECT comprar_ticket(
          ${dto.user_id}::bigint,
          ${dto.showtime_id}::bigint,
          ${dto.row}::varchar,
          ${dto.seat_number}::int
        ) AS mensaje
      `;

        const mensaje = result[0]?.mensaje;

        if (!mensaje || !mensaje.includes('éxito')) {
          throw new BadRequestException(
            `Error comprando ticket fila ${dto.row} asiento ${dto.seat_number}: ${mensaje}`
          );
        }

        const showtime = await tx.showtimes.findUnique({
          where: { id: dto.showtime_id },
          select: { room_id: true },
        });

        if (!showtime) {
          throw new Error('Showtime no existe');
        }

        // Buscar ticket recién creado
        const data = await tx.tickets.findFirst({
          where: {
            user_id: dto.user_id,
            showtime_id: dto.showtime_id,
            seat: {
              row: dto.row,
              seat_number: dto.seat_number,
              room_id: showtime.room_id,
            },
          },
          include: {
            user: true,
            showtime: {
              include: {
                movie: true,
                room: true,
              },
            },
            seat: true,
          },
        });

        tickets.push(this.toTicketDto(data));
      }

      return tickets;
    });
  }

  async getAllTickets(): Promise<TicketBaseDto[]> {
    const data = await this.prisma.tickets.findMany({
      include: {
        user: true,
        showtime: {
          include: {
            movie: true,
            room: true
          }
        },
        seat: true
      }
    });

    const tickets: TicketBaseDto[] = data.map(this.toTicketDto);

    return tickets;
  }

  async getTicketById(id: number): Promise<TicketBaseDto> {
    const data = await this.prisma.tickets.findUnique({
      where: { id },
      include: {
        user: true,
        showtime: {
          include: {
            movie: true,
            room: true
          }
        },
        seat: true
      }
    });
    if (!data) throw new NotFoundException(`Ticket ${id} not found`);

    const ticket: TicketBaseDto = this.toTicketDto(data)

    return ticket;
  }

  async getTicketsByUser(user_id: number): Promise<TicketBaseDto[]> {
    const data = await this.prisma.tickets.findMany({
      where: { user_id },
      include: {
        user: true,
        showtime: {
          include: {
            movie: true,
            room: true
          }
        },
        seat: true
      }
    });

    const tickets: TicketBaseDto[] = data.map(this.toTicketDto);

    return tickets;
  }

  async getTicketsByShowtime(showtime_id: number): Promise<TicketBaseDto[]> {
    const data = await this.prisma.tickets.findMany({
      where: { showtime_id },
      include: {
        user: true,
        showtime: {
          include: {
            movie: true,
            room: true
          }
        },
        seat: true
      }
    });

    const tickets: TicketBaseDto[] = data.map(this.toTicketDto);

    return tickets;
  }

  private toTicketDto = (data: any): TicketBaseDto => {
    const a = plainToInstance(TicketBaseDto, {
      id: Number(data.id),
      user: {
        ...data.user,
        id: Number(data.user.id),
      },
      showtime: {
        start_time: data.showtime.start_time,
        format: data.showtime.format,
        price: data.showtime.price,
        id: Number(data.showtime.id),
        movie: {
          ...data.showtime.movie,
          id: Number(data.showtime.movie.id),
        },
        room: {
          ...data.showtime.room,
          id: Number(data.showtime.room.id),
        },
      },
      seat: {
        id: Number(data.seat.id),
        seat_number: data.seat.seat_number,
        row: data.seat.row,
        is_occupied: data.seat.is_occupied,
      },
      purchase_date: data.purchase_date,
    });
    return a;
  };
}
