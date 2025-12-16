import { OmitType } from "@nestjs/swagger";
import { RoomDto } from "./room.dto";

export class CreateRoomDto extends OmitType(RoomDto, ['id'] as const) { }