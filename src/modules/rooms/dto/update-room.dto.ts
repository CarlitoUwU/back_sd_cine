import { OmitType, PartialType } from '@nestjs/swagger';
import { RoomDto } from './room.dto';

export class UpdateRoomDto extends PartialType(OmitType(RoomDto, ['id'] as const)) { }
