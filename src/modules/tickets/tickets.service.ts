import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTicketDto, TicketBaseDto } from './dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) { }

  async createTicket(dto: CreateTicketDto): Promise<TicketBaseDto> {
    const result = await this.prisma.$queryRawUnsafe<{ mensaje: string }[]>(
      `CALL sp_ComprarTicket(${dto.user_id}, ${dto.showtime_id}, '${dto.row}', ${dto.seat_number})`
    );

    const mensaje = result[0]?.['f0'];

    if (!mensaje || !mensaje.includes('éxito')) {
      throw new BadRequestException(mensaje);
    }

    const showtime = await this.prisma.showtimes.findUnique({
      where: { id: dto.showtime_id },
      select: { room_id: true },
    });
    if (!showtime) throw new Error("Showtime no existe");
    const roomId = showtime.room_id;

    const data = await this.prisma.tickets.findFirst({
      where: {
        user_id: dto.user_id,
        showtime_id: dto.showtime_id,
        seat: {
          row: dto.row,
          seat_number: dto.seat_number,
          room_id: roomId,
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

    const ticket: TicketBaseDto = this.toTicketDto(data);

    return ticket;
  }

  async createMultipleTickets(dtos: CreateTicketDto[]): Promise<TicketBaseDto[]> {
    return await this.prisma.$transaction(async (tx) => {
      const tickets: TicketBaseDto[] = [];

      for (const dto of dtos) {
        // Llamas el stored procedure usando tx.$queryRawUnsafe para usar la misma transacción
        const result = await tx.$queryRawUnsafe<{ mensaje: string }[]>(
          `CALL sp_ComprarTicketSinRollBack(${dto.user_id}, ${dto.showtime_id}, '${dto.row}', ${dto.seat_number})`
        );

        const mensaje = result[0]?.['f0'];

        if (!mensaje || !mensaje.includes('éxito')) {
          // Si falla, lanza error para que se haga rollback automático
          throw new BadRequestException(`Error comprando ticket fila ${dto.row} asiento ${dto.seat_number}: ${mensaje}`);
        }

        // Obtener room_id para la búsqueda
        const showtime = await tx.showtimes.findUnique({
          where: { id: dto.showtime_id },
          select: { room_id: true },
        });
        if (!showtime) throw new Error("Showtime no existe");
        const roomId = showtime.room_id;

        // Buscar el ticket recién comprado para retornar datos
        const data = await tx.tickets.findFirst({
          where: {
            user_id: dto.user_id,
            showtime_id: dto.showtime_id,
            seat: {
              row: dto.row,
              seat_number: dto.seat_number,
              room_id: roomId,
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

      // Si llegamos hasta acá sin excepción, la transacción se comitea automáticamente
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
