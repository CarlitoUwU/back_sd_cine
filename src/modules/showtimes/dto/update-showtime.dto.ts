import { PartialType, OmitType } from '@nestjs/swagger';
import { ShowtimeDto } from './showtime.dto';

export class UpdateShowtimeDto extends PartialType(OmitType(ShowtimeDto, ['id'] as const)) { }
