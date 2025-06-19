import { Controller, Post, Body, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketDto } from './dto/ticket.dto';
import { CreateTicketDto } from './dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) { }

  @Post()
  @ApiOperation({ summary: 'Buy a ticket' })
  @ApiResponse({ status: 201, type: TicketDto })
  create(@Body() dto: CreateTicketDto) {
    return this.ticketsService.createTicket(dto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Buy multiple tickets in a single transaction' })
  @ApiResponse({ status: 201, description: 'Tickets purchased successfully', type: [TicketDto] })
  @ApiResponse({ status: 400, description: 'Error buying one or more tickets' })
  createMultiple(@Body() dtos: CreateTicketDto[]) {
    return this.ticketsService.createMultipleTickets(dtos);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tickets' })
  @ApiResponse({ status: 200, type: TicketDto, isArray: true })
  findAll() {
    return this.ticketsService.getAllTickets();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a ticket by ID' })
  @ApiResponse({ status: 200, type: TicketDto })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.getTicketById(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get tickets by user ID' })
  @ApiResponse({ status: 200, type: TicketDto, isArray: true })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.ticketsService.getTicketsByUser(userId);
  }

  @Get('showtime/:showtimeId')
  @ApiOperation({ summary: 'Get tickets by showtime ID' })
  @ApiResponse({ status: 200, type: TicketDto, isArray: true })
  findByShowtime(@Param('showtimeId', ParseIntPipe) showtimeId: number) {
    return this.ticketsService.getTicketsByShowtime(showtimeId);
  }
}
