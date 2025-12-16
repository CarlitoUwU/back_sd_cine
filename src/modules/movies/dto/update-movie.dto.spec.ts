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

  it('should be valid without id and with required fields', async () => {
    const dto = new UpdateMovieDto();

    dto.title = 'Inception';
    dto.duration = 148;

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should be invalid if title is not present', async () => {
    const dto = new UpdateMovieDto();

    dto.duration = 148;

    const errors = await validate(dto);
    const titleErrors = errors.find(error => error.property === 'title');

    expect(titleErrors).toBeDefined();
  });

  it('should be invalid if duration is not present', async () => {
    const dto = new UpdateMovieDto();

    dto.title = 'Inception';

    const errors = await validate(dto);
    const durationErrors = errors.find(error => error.property === 'duration');

    expect(durationErrors).toBeDefined();
  });

  it('should be invalid if duration is less than 1', async () => {
    const dto = new UpdateMovieDto();

    dto.title = 'Inception';
    dto.duration = 0;

    const errors = await validate(dto);
    const durationErrors = errors.find(error => error.property === 'duration');

    expect(durationErrors).toBeDefined();
    expect(durationErrors?.constraints).toHaveProperty('min');
  });
});
