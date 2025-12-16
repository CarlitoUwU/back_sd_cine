import { OmitType } from '@nestjs/swagger';
import { SeatDto } from './seat.dto';

export class SeatBaseDto extends OmitType(SeatDto, [] as const) { }
