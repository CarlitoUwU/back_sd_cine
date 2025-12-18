import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { PrismaService } from 'src/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { NotFoundException } from '@nestjs/common';

describe('MoviesService', () => {
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
      providers: [
        MoviesService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a movie', async () => {
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

    prismaMock.movies.create.mockResolvedValue({
      id: 1,
      ...dto,
    });

    const result = await service.createMovie(dto);

    expect(prismaMock.movies.create).toHaveBeenCalled();
    expect(result.title).toBe(dto.title);
  });

  it('should create a movie with optional fields undefined', async () => {
    const dtoMinimal: CreateMovieDto = {
      title: 'Minimal Movie',
      duration: 90,
    };

    prismaMock.movies.create.mockResolvedValue({
      id: 2,
      title: dtoMinimal.title,
      duration: dtoMinimal.duration,
    });

    const result = await service.createMovie(dtoMinimal);

    expect(prismaMock.movies.create).toHaveBeenCalled();
    expect(result.id).toBe(2);
    expect(result.description).toBeUndefined();
    expect(result.url_poster).toBeUndefined();
    expect(result.rating).toBeUndefined();
  });

  it('should get a movie by id', async () => {
    prismaMock.movies.findUnique.mockResolvedValue({
      id: 1,
      title: 'Inception',
      duration: 148,
      description: 'A mind-bending thriller',
      url_poster: 'https://example.com/poster.jpg',
      url_background: 'https://example.com/bg.jpg',
      url_trailer: 'https://example.com/trailer.mp4',
      genre: 'Science Fiction',
      rating: 4.5,
    });

    const result = await service.getMoviesById(1);

    expect(prismaMock.movies.findUnique).toHaveBeenCalled();
    expect(result.id).toBe(1);
  });

  it('should get a movie by id with missing optional fields', async () => {
    prismaMock.movies.findUnique.mockResolvedValue({
      id: 3,
      title: 'Minimal',
      duration: 75,
    });

    const result = await service.getMoviesById(3);

    expect(prismaMock.movies.findUnique).toHaveBeenCalled();
    expect(result.id).toBe(3);
    expect(result.description).toBeUndefined();
    expect(result.url_trailer).toBeUndefined();
    expect(result.genre).toBeUndefined();
  });

  it('should get movies', async () => {
    prismaMock.movies.findMany.mockResolvedValue([
      {
        id: 1,
        title: 'Inception',
        duration: 148,
        description: 'A mind-bending thriller',
        url_poster: 'https://example.com/poster.jpg',
        url_background: 'https://example.com/bg.jpg',
        url_trailer: 'https://example.com/trailer.mp4',
        genre: 'Science Fiction',
        rating: 4.5,
      },
    ]);

    const result = await service.getMovies();

    expect(prismaMock.movies.findMany).toHaveBeenCalled();
    expect(result.length).toBe(1);
  });

  it('should get movies with optional fields missing', async () => {
    prismaMock.movies.findMany.mockResolvedValue([
      {
        id: 4,
        title: 'Minimal List',
        duration: 60,
      },
    ]);

    const result = await service.getMovies();

    expect(prismaMock.movies.findMany).toHaveBeenCalled();
    expect(result.length).toBe(1);
    expect(result[0].description).toBeUndefined();
    expect(result[0].url_poster).toBeUndefined();
  });

  it('should update a movie', async () => {
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

    prismaMock.movies.update.mockResolvedValue({
      id: 1,
      ...dto,
    });

    const result = await service.updateMovie(1, dto);

    expect(prismaMock.movies.update).toHaveBeenCalled();
    expect(result.id).toBe(1);
  });

  it('should update a movie with optional fields undefined', async () => {
    const dtoMinimal: CreateMovieDto = {
      title: 'Updated Minimal',
      duration: 95,
    };

    prismaMock.movies.update.mockResolvedValue({
      id: 5,
      title: dtoMinimal.title,
      duration: dtoMinimal.duration,
    });

    const result = await service.updateMovie(5, dtoMinimal);

    expect(prismaMock.movies.update).toHaveBeenCalled();
    expect(result.id).toBe(5);
    expect(result.description).toBeUndefined();
    expect(result.genre).toBeUndefined();
  });

  it('should delete a movie', async () => {
    prismaMock.movies.findUnique.mockResolvedValue({
      id: 1,
      title: 'Inception',
      duration: 148,
      description: 'A mind-bending thriller',
      url_poster: 'https://example.com/poster.jpg',
      url_background: 'https://example.com/bg.jpg',
      url_trailer: 'https://example.com/trailer.mp4',
      genre: 'Science Fiction',
      rating: 4.5,
    });

    prismaMock.movies.delete.mockResolvedValue({
      id: 1,
      title: 'Inception',
      duration: 148,
      description: 'A mind-bending thriller',
      url_poster: 'https://example.com/poster.jpg',
      url_background: 'https://example.com/bg.jpg',
      url_trailer: 'https://example.com/trailer.mp4',
      genre: 'Science Fiction',
      rating: 4.5,
    });

    const result = await service.deleteMovie(1);

    expect(prismaMock.movies.delete).toHaveBeenCalled();
    expect(result.id).toBe(1);
  });

  it('should delete a movie that has missing optional fields', async () => {
    prismaMock.movies.findUnique.mockResolvedValue({
      id: 6,
      title: 'To Delete',
      duration: 80,
    });

    prismaMock.movies.delete.mockResolvedValue({
      id: 6,
      title: 'To Delete',
      duration: 80,
    });

    const result = await service.deleteMovie(6);

    expect(prismaMock.movies.delete).toHaveBeenCalled();
    expect(result.id).toBe(6);
    expect(result.url_background).toBeUndefined();
    expect(result.url_trailer).toBeUndefined();
  });

  it('should throw NotFoundException if movie not found by id', async () => {
    prismaMock.movies.findUnique.mockResolvedValue(null);

    await expect(service.getMoviesById(999)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException when deleting a non-existing movie', async () => {
    prismaMock.movies.findUnique.mockResolvedValue(null);

    await expect(service.deleteMovie(999)).rejects.toThrow(NotFoundException);
  });
});
