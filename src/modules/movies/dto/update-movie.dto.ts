import { PartialType, OmitType } from '@nestjs/swagger';
import { MovieDto } from './movie.dto';

export class UpdateMovieDto extends PartialType(OmitType(MovieDto, ['id'] as const)) { }
