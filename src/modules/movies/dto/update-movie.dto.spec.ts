import { validate } from 'class-validator';
import { UpdateMovieDto } from './update-movie.dto';

describe('UpdateMovieDto', () => {
  it('should be valid when empty (all fields optional)', async () => {
    const dto = new UpdateMovieDto();

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should be valid without id and with all fields', async () => {
    const dto = new UpdateMovieDto();

    dto.title = 'Inception';
    dto.duration = 148;
    dto.url_poster = 'https://example.com/images/poster.jpg';
    dto.url_background = 'https://example.com/images/background.jpg';
    dto.url_trailer = 'https://example.com/videos/trailer.mp4';
    dto.genre = 'Science Fiction';
    dto.rating = 4.5;
    dto.description = 'A mind-bending thriller about dreams within dreams.';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });
});
