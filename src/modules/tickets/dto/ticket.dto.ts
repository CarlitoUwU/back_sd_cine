import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsNotEmpty } from 'class-validator';

export class TicketDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 1 })
  id: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 1 })
  user_id: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 2 })
  showtime_id: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 5 })
  seat_id: number;

  @IsNotEmpty()
  @IsDate()
  @ApiProperty({ example: new Date().toISOString() })
  purchase_date?: Date;
}