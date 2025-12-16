import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MovieBaseDto } from './dto/movie-base.dto';
import { CreateMovieDto } from './dto/create-movie.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';

@Controller('movies')
export class MoviesController {

  constructor(private moviesService: MoviesService) { }

  @ApiTags('Movies')
  @Get()
  @ApiOperation({ summary: 'Get all movies' })
  @ApiResponse({
    status: 200,
    description: 'Returns all movies',
    type: MovieBaseDto,
    isArray: true,
  })
  getAllMovies() {
    return this.moviesService.getMovies();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get movie by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Movie ID' })
  @ApiResponse({
    status: 200,
    description: 'Movie found',
    type: MovieBaseDto,
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  getMovieById(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.getMoviesById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiResponse({
    status: 201,
    description: 'Movie created successfully',
    type: MovieBaseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid movie data' })
  createMovie(@Body() movie: CreateMovieDto) {
    return this.moviesService.createMovie(movie);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a movie' })
  @ApiParam({ name: 'id', type: Number, description: 'Movie ID' })
  @ApiResponse({
    status: 200,
    description: 'Movie updated successfully',
    type: MovieBaseDto,
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({ status: 400, description: 'Invalid data for update' })
  updateMovie(@Param('id', ParseIntPipe) id: number, @Body() movie: CreateMovieDto) {
    return this.moviesService.updateMovie(id, movie);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a movie by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Movie ID' })
  @ApiResponse({
    status: 200,
    description: 'Movie deleted successfully',
    type: MovieBaseDto
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  deleteMovie(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.deleteMovie(id);
  }
}
