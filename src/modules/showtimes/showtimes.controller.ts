import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto, ShowtimeBaseDto } from './dto';

@ApiTags('Showtimes')
@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) { }

  @Get()
  @ApiOperation({ summary: 'Get all showtimes' })
  @ApiResponse({ status: 200, description: 'List of showtimes', type: ShowtimeBaseDto, isArray: true })
  getAll() {
    return this.showtimesService.getShowtimes();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get showtime by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Showtime found', type: ShowtimeBaseDto })
  @ApiResponse({ status: 404, description: 'Showtime not found' })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.showtimesService.getShowtimeById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new showtime' })
  @ApiResponse({ status: 201, description: 'Showtime created', type: ShowtimeBaseDto })
  create(@Body() dto: CreateShowtimeDto) {
    return this.showtimesService.createShowtime(dto);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a showtime by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Showtime updated', type: ShowtimeBaseDto })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateShowtimeDto) {
    return this.showtimesService.updateShowtime(id, dto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a showtime by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Showtime deleted', type: ShowtimeBaseDto })
  @ApiResponse({ status: 404, description: 'Showtime not found' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.showtimesService.deleteShowtime(id);
  }
}
