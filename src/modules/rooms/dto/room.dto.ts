import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class RoomDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ description: 'Unique identifier for the room', type: Number, example: 1 })
  id!: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @ApiProperty({ description: 'Name of the room', type: String, example: 'Room A' })
  name!: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @ApiProperty({ description: 'Capacity of the room (number of seats)', type: Number, example: 50 })
  capacity!: number;
}
