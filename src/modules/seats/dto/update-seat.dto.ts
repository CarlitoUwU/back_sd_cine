import { PartialType, OmitType } from '@nestjs/swagger';
import { SeatDto } from './seat.dto';

export class UpdateSeatDto extends PartialType(OmitType(SeatDto, ['id'] as const)) { }
