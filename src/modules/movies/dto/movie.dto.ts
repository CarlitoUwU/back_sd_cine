import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Min,
  IsUrl,
  IsNumber,
  Max,
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
  @IsUrl()
  @ApiPropertyOptional({ description: 'URL of the movie poster image', type: String, example: 'https://example.com/images/poster.jpg' })
  url_poster?: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({ description: 'URL of the movie background image', type: String, example: 'https://example.com/images/background.jpg' })
  url_background?: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({ description: 'URL of the movie trailer', type: String, example: 'https://example.com/videos/trailer.mp4' })
  url_trailer?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Genre of the movie', type: String, example: 'Science Fiction' })
  genre?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  @ApiPropertyOptional({ description: 'Rating of the movie (e.g., 0-5.0)', type: Number, example: 4.5 })
  rating?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Short description of the movie', type: String, example: 'A mind-bending thriller about dreams within dreams.' })
  description?: string;
}
