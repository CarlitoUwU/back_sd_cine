import { OmitType } from '@nestjs/swagger';
import { TicketDto } from './ticket.dto';

export class TicketBaseDto extends OmitType(TicketDto, [] as const) { }
