import { Controller } from '@nestjs/common';
import { SeatsService } from './seats.service';

@Controller('seats')
export class SeatsController {

  constructor(private seatsService: SeatsService) { }

}
