import { OmitType } from '@nestjs/swagger';
import { ShowtimeDto } from './showtime.dto';

export class ShowtimeBaseDto extends OmitType(ShowtimeDto, [] as const) { }

export class CreateShowtimeDto extends OmitType(ShowtimeDto, ['id'] as const) { }
