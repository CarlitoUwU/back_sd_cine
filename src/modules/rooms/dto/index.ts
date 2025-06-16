import { OmitType } from '@nestjs/swagger';
import { RoomDto } from './room.dto';

export class RoomBaseDto extends (RoomDto) { }

export class CreateRoomDto extends OmitType(RoomDto, ['id'] as const) { }

export class UpdateRoomDto extends OmitType(RoomDto, ['id'] as const) { }
