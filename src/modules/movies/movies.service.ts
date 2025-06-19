import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto, MovieBaseDto } from './dto';
import { PrismaService } from 'src/prisma.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MoviesService {

  constructor(private prisma: PrismaService) { }

  async getMovies(): Promise<MovieBaseDto[]> {
    const data = await this.prisma.movies.findMany({
      select: {
        id: true,
        title: true,
        duration: true,
        description: true,
        url_poster: true,
        url_background: true,
        url_trailer: true,
        genre: true,
        rating: true,
      },
    });

    const movies: MovieBaseDto[] = data.map(movie => ({
      id: Number(movie.id),
      title: movie.title,
      duration: movie.duration,
      description: movie.description ?? undefined,
      url_poster: movie.url_poster ?? undefined,
      url_background: movie.url_background ?? undefined,
      url_trailer: movie.url_trailer ?? undefined,
      genre: movie.genre ?? undefined,
      rating: movie.rating ?? undefined,
    }));

    return movies.map(movie => plainToInstance(MovieBaseDto, movie))
  }

  async getMoviesById(id: number): Promise<MovieBaseDto> {
    const data = await this.prisma.movies.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        duration: true,
        description: true,
        url_poster: true,
        url_background: true,
        url_trailer: true,
        genre: true,
        rating: true,
      }
    })

    if (!data) {
      throw new NotFoundException(`Movie with ID ${id} not found`)
    }

    const movie: MovieBaseDto = {
      id: Number(data.id),
      title: data.title,
      duration: data.duration,
      url_poster: data.url_poster ?? undefined,
      url_background: data.url_background ?? undefined,
      url_trailer: data.url_trailer ?? undefined,
      genre: data.genre ?? undefined,
      rating: data.rating ?? undefined,
    }

    return plainToInstance(MovieBaseDto, movie)
  }

  async createMovie(obj: CreateMovieDto): Promise<MovieBaseDto> {
    const data = await this.prisma.movies.create({
      data: {
        title: obj.title,
        duration: obj.duration,
        description: obj.description,
        url_poster: obj.url_poster ?? undefined,
        url_background: obj.url_background ?? undefined,
        url_trailer: obj.url_trailer ?? undefined,
        genre: obj.genre ?? undefined,
        rating: obj.rating ?? undefined,
      },
      select: {
        id: true,
        title: true,
        duration: true,
        description: true,
        url_poster: true,
        url_background: true,
        url_trailer: true,
        genre: true,
        rating: true,
      }
    })

    const movie: MovieBaseDto = {
      id: Number(data.id),
      title: data.title,
      duration: data.duration,
      url_poster: data.url_poster ?? undefined,
      url_background: data.url_background ?? undefined,
      url_trailer: data.url_trailer ?? undefined,
      genre: data.genre ?? undefined,
      rating: data.rating ?? undefined,
    }

    return plainToInstance(MovieBaseDto, movie);
  }

  async updateMovie(id: number, obj: CreateMovieDto): Promise<MovieBaseDto> {
    const data = await this.prisma.movies.update({
      where: { id },
      data: {
        title: obj.title,
        duration: obj.duration,
        description: obj.description,
        url_poster: obj.url_poster ?? undefined,
        url_background: obj.url_background ?? undefined,
        url_trailer: obj.url_trailer ?? undefined,
        genre: obj.genre ?? undefined,
        rating: obj.rating ?? undefined,
      },
      select: {
        id: true,
        title: true,
        duration: true,
        description: true,
        url_poster: true,
        url_background: true,
        url_trailer: true,
        genre: true,
        rating: true,
      },
    });

    const movie: MovieBaseDto = {
      ...data,
      id: Number(data.id),
      description: data.description ?? undefined,
      url_poster: data.url_poster ?? undefined,
      url_background: data.url_background ?? undefined,
      url_trailer: data.url_trailer ?? undefined,
      genre: data.genre ?? undefined,
      rating: data.rating ?? undefined,
    }

    return plainToInstance(MovieBaseDto, movie);
  }

  async deleteMovie(id: number): Promise<MovieBaseDto> {
    const movie = await this.prisma.movies.findUnique({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    await this.prisma.movies.delete({
      where: { id },
    });

    const deletedMovie: MovieBaseDto = {
      ...movie,
      id: Number(movie.id),
      description: movie.description || undefined,
      url_poster: movie.url_poster ?? undefined,
      url_background: movie.url_background ?? undefined,
      url_trailer: movie.url_trailer ?? undefined,
      genre: movie.genre ?? undefined,
      rating: movie.rating ?? undefined,
    }

    return plainToInstance(MovieBaseDto, deletedMovie);
  }

}
