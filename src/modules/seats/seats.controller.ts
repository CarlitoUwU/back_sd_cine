import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { SeatsService } from './seats.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { SeatBaseDto } from './dto/seat-base.dto';

@ApiTags('Seats')
@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) { }

  @Get()
  @ApiOperation({ summary: 'Get all seats' })
  @ApiResponse({ status: 200, description: 'List of seats', type: SeatBaseDto, isArray: true })
  getAll() {
    return this.seatsService.getSeats();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get seat by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Seat found', type: SeatBaseDto })
  @ApiResponse({ status: 404, description: 'Seat not found' })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.seatsService.getSeatById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new seat' })
  @ApiResponse({ status: 201, description: 'Seat created', type: SeatBaseDto })
  create(@Body() dto: CreateSeatDto) {
    return this.seatsService.createSeat(dto);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a seat by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Seat updated', type: SeatBaseDto })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateSeatDto) {
    return this.seatsService.updateSeat(id, dto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a seat by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Seat deleted', type: SeatBaseDto })
  @ApiResponse({ status: 404, description: 'Seat not found' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.seatsService.deleteSeat(id);
  }

  @Patch('/:id/occupy')
  @ApiOperation({ summary: 'Mark seat as occupied' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Seat marked as occupied', type: SeatBaseDto })
  @ApiResponse({ status: 404, description: 'Seat not found' })
  occupy(@Param('id', ParseIntPipe) id: number) {
    return this.seatsService.occupySeat(id);
  }

  @Patch('/:id/free')
  @ApiOperation({ summary: 'Mark seat as unoccupied' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Seat marked as free', type: SeatBaseDto })
  @ApiResponse({ status: 404, description: 'Seat not found' })
  free(@Param('id', ParseIntPipe) id: number) {
    return this.seatsService.freeSeat(id);
  }
}
