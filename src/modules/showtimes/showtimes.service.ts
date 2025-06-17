import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateShowtimeDto, ShowtimeBaseDto } from './dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ShowtimesService {
  constructor(private prisma: PrismaService) { }

  async getShowtimes(): Promise<ShowtimeBaseDto[]> {
    const data = await this.prisma.showtimes.findMany({
      include: {
        movie: true,
        room: true,
      },
    });

    const showTimes: ShowtimeBaseDto[] = data.map(this.toShowtimeDto);

    return showTimes.map(showtime => plainToInstance(ShowtimeBaseDto, showtime));
  }

  async getShowtimeById(id: number): Promise<ShowtimeBaseDto> {
    const data = await this.prisma.showtimes.findUnique({
      where: { id },
      include: {
        movie: true,
        room: true,
      }
    });

    if (!data) {
      throw new NotFoundException(`Showtime with ID ${id} not found`);
    }

    const showtime: ShowtimeBaseDto = this.toShowtimeDto(data)

    return plainToInstance(ShowtimeBaseDto, showtime);
  }

  async createShowtime(dto: CreateShowtimeDto): Promise<ShowtimeBaseDto> {
    const newShowtime = await this.prisma.showtimes.create({
      data: {
        movie_id: dto.movie_id,
        room_id: dto.room_id,
        start_time: dto.start_time,
      },
      include: {
        movie: true,
        room: true,
      },
    });

    const showtime: ShowtimeBaseDto = this.toShowtimeDto(newShowtime);

    return plainToInstance(ShowtimeBaseDto, showtime);
  }

  async updateShowtime(id: number, dto: CreateShowtimeDto): Promise<ShowtimeBaseDto> {
    const updated = await this.prisma.showtimes.update({
      where: { id },
      data: {
        movie_id: dto.movie_id,
        room_id: dto.room_id,
        start_time: dto.start_time,
      },
      include: {
        movie: true,
        room: true,
      },
    });

    const showtime: ShowtimeBaseDto = this.toShowtimeDto(updated)

    return plainToInstance(ShowtimeBaseDto, showtime);
  }

  async deleteShowtime(id: number): Promise<ShowtimeBaseDto> {
    const existing = await this.prisma.showtimes.findUnique({ where: { id }, include: { movie: true, room: true }, });

    if (!existing) {
      throw new NotFoundException(`Showtime with ID ${id} not found`);
    }

    await this.prisma.showtimes.delete({ where: { id } });

    const showtime: ShowtimeBaseDto = this.toShowtimeDto(existing)

    return plainToInstance(ShowtimeBaseDto, showtime);
  }

  private toShowtimeDto = (data: any): ShowtimeBaseDto => {
    return plainToInstance(ShowtimeBaseDto, {
      id: Number(data.id),
      movie: {
        ...data.movie,
        id: Number(data.movie.id),
        url: data.movie.url ?? undefined,
        description: data.movie.description ?? undefined,
      },
      room: {
        ...data.room,
        id: Number(data.room.id),
      },
      start_time: data.start_time,
    });
  }
}
