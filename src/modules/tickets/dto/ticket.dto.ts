import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { SeatBaseDto } from '../../seats/dto/seat-base.dto';
import { ShowtimeBaseDto } from '../../showtimes/dto/showtime-base.dto';
import { UserBaseDto } from '../../users/dto/user-base.dto';
import { Type } from 'class-transformer';

export class TicketDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 1 })
  id!: number;

  @IsNotEmpty()
  @Type(() => UserBaseDto)
  @ApiProperty({ type: () => UserBaseDto })
  user!: UserBaseDto;

  @IsNotEmpty()
  @Type(() => ShowtimeBaseDto)
  @ApiProperty({ type: () => ShowtimeBaseDto })
  showtime!: ShowtimeBaseDto;

  @IsNotEmpty()
  @Type(() => SeatBaseDto)
  @ApiProperty({ type: () => SeatBaseDto })
  seat!: SeatBaseDto;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({ example: new Date().toISOString() })
  purchase_date?: Date;
}