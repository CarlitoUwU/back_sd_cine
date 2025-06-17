import { OmitType } from '@nestjs/swagger';
import { SeatDto } from './seat.dto';

export class SeatBaseDto extends OmitType(SeatDto, [] as const) { }

export class CreateSeatDto extends OmitType(SeatDto, ['id'] as const) { }
