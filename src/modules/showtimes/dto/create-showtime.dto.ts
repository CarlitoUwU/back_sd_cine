import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateShowtimeDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1 })
  movie_id!: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 2 })
  room_id!: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @ApiProperty()
  start_time!: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'IMAX 3D' })
  format!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 12.99 })
  price!: number;
}
