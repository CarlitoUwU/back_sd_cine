import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsNotEmpty } from 'class-validator';
import { SeatBaseDto } from 'src/modules/seats/dto';
import { ShowtimeBaseDto } from 'src/modules/showtimes/dto';
import { UserBaseDto } from 'src/modules/users/dto/user-base.dto';

export class TicketDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 1 })
  id: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 1 })
  user: UserBaseDto;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 2 })
  showtime: ShowtimeBaseDto;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 5 })
  seat: SeatBaseDto;

  @IsNotEmpty()
  @IsDate()
  @ApiProperty({ example: new Date().toISOString() })
  purchase_date?: Date;
}