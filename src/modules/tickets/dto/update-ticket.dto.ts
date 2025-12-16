import { PartialType, OmitType } from '@nestjs/swagger';
import { TicketDto } from './ticket.dto';

export class UpdateTicketDto extends PartialType(OmitType(TicketDto, ['id'] as const)) { }
