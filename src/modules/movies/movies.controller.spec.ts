import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MoviesController } from './movies.controller';
import { PrismaService } from 'src/prisma.service';
import { MovieBaseDto } from './dto/movie-base.dto';

const dto: CreateMovieDto = {
  title: 'Inception',
  duration: 148,
  description: 'A mind-bending thriller',
  url_poster: 'https://example.com/poster.jpg',
  url_background: 'https://example.com/bg.jpg',
  url_trailer: 'https://example.com/trailer.mp4',
  genre: 'Science Fiction',
  rating: 4.5,
};

const response: MovieBaseDto = {
  id: 1,
  title: 'Inception',
  duration: 148,
  description: 'A mind-bending thriller',
  url_poster: 'https://example.com/poster.jpg',
  url_background: 'https://example.com/bg.jpg',
  url_trailer: 'https://example.com/trailer.mp4',
  genre: 'Science Fiction',
  rating: 4.5,
};

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  const prismaMock = {
    movies: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        MoviesService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call MoviesService.createMovie', async () => {
    jest.spyOn(service, 'createMovie').mockResolvedValue(response);

    const result = await controller.createMovie(dto);

    expect(service.createMovie).toHaveBeenCalledWith(dto);
    expect(result).toEqual(response);
  });

  it('should call MoviesService.getMovies', async () => {
    jest.spyOn(service, 'getMovies').mockResolvedValue([response]);

    const result = await controller.getAllMovies();

    expect(service.getMovies).toHaveBeenCalled();
    expect(result).toEqual([response]);
  });

  it('should call MoviesService.getMovieById', async () => {
    jest.spyOn(service, 'getMoviesById').mockResolvedValue(response);

    const result = await controller.getMovieById(1);

    expect(service.getMoviesById).toHaveBeenCalledWith(1);
    expect(result).toEqual(response);
  });

  it('should call MoviesService.updateMovie', async () => {
    jest.spyOn(service, 'updateMovie').mockResolvedValue(response);

    const result = await controller.updateMovie(1, dto);

    expect(service.updateMovie).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual(response);
  });

  it('should call MoviesService.deleteMovie', async () => {
    jest.spyOn(service, 'deleteMovie').mockResolvedValue(response);

    const result = await controller.deleteMovie(1);

    expect(service.deleteMovie).toHaveBeenCalledWith(1);
    expect(result).toEqual(response);
  });
});
