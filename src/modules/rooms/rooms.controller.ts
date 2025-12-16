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
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomBaseDto } from './dto/room-base.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) { }

  @Get()
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiResponse({ status: 200, description: 'List of rooms', type: RoomBaseDto, isArray: true })
  getAll() {
    return this.roomsService.getRooms();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get room by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Room found', type: RoomBaseDto })
  @ApiResponse({ status: 404, description: 'Room not found' })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.getRoomById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({ status: 201, description: 'Room created', type: RoomBaseDto })
  create(@Body() dto: CreateRoomDto) {
    return this.roomsService.createRoom(dto);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a room by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Room updated', type: RoomBaseDto })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateRoomDto) {
    return this.roomsService.updateRoom(id, dto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a room by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Room deleted', type: RoomBaseDto })
  @ApiResponse({ status: 404, description: 'Room not found' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.deleteRoom(id);
  }
}
