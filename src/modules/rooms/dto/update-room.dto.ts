import { OmitType } from '@nestjs/swagger';
import { RoomDto } from './room.dto';

export class UpdateRoomDto extends OmitType(RoomDto, ['id'] as const) { }
