import { OmitType } from '@nestjs/swagger';
import { MovieDto } from './movie.dto';

export class MovieBaseDto extends (MovieDto) { }

export class CreateMovieDto extends OmitType(MovieDto, ['id'] as const) { }

export class UpdateMovieDto extends OmitType(MovieDto, ['id'] as const) { }
