import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Min,
} from 'class-validator';

export class MovieDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ description: 'Unique identifier for the movie', type: Number, example: 1 })
  id!: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @ApiProperty({ description: 'Title of the movie', type: String, example: 'Inception' })
  title!: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @ApiProperty({ description: 'Duration of the movie in minutes', type: Number, example: 148 })
  duration!: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Short description of the movie', type: String, example: 'A mind-bending thriller about dreams within dreams.' })
  description?: string;
}
