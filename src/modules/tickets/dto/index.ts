import { OmitType } from '@nestjs/swagger';
import { TicketDto } from './ticket.dto';

export class TicketBaseDto extends OmitType(TicketDto, [] as const) { }

export class CreateTicketDto extends OmitType(TicketDto, ['id'] as const) { }