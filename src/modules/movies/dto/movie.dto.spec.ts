import { validate } from 'class-validator';
import { MovieDto } from './movie.dto';

describe('MovieDto', () => {
  it('should be valid with correct data', async () => {
    const dto = new MovieDto();

    dto.id = 1;
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

  it('should be valid with default data', async () => {
    const dto = new MovieDto();

    dto.id = 1;
    dto.title = 'Inception';
    dto.duration = 148;

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should be invalid if id is not present', async () => {
    const dto = new MovieDto();

    dto.title = 'Inception';
    dto.duration = 148;

    const errors = await validate(dto);
    const idErrors = errors.find(error => error.property === 'id');
    const constraints = idErrors?.constraints;

    expect(idErrors).toBeDefined();
    expect(constraints).toHaveProperty('isNotEmpty');
  });

  it('should be invalid if id is not an integer', async () => {
    const dto = new MovieDto();

    dto.id = '1' as unknown as number;
    dto.title = 'Inception';
    dto.duration = 148;

    const errors = await validate(dto);
    const idErrors = errors.find(error => error.property === 'id');
    const constraints = idErrors?.constraints;

    expect(idErrors).toBeDefined();
    expect(constraints).toHaveProperty('isInt');
  });

  it('should be invalid if title is not present', async () => {
    const dto = new MovieDto();

    dto.id = 1;
    dto.duration = 148;

    const errors = await validate(dto);
    const titleErrors = errors.find(error => error.property === 'title');

    expect(titleErrors).toBeDefined();
  });

  it('should be invalid if duration is not present', async () => {
    const dto = new MovieDto();

    dto.id = 1;
    dto.title = 'Inception';

    const errors = await validate(dto);
    const durationErrors = errors.find(error => error.property === 'duration');

    expect(durationErrors).toBeDefined();
  });

  it('should be invalid if duration is less than 1', async () => {
    const dto = new MovieDto();

    dto.id = 1;
    dto.title = 'Inception';
    dto.duration = 0;

    const errors = await validate(dto);
    const durationErrors = errors.find(error => error.property === 'duration');
    const constraints = durationErrors?.constraints;

    expect(durationErrors).toBeDefined();
    expect(constraints).toHaveProperty('min');
  });

  it('should be invalid if poster url is not a valid url', async () => {
    const dto = new MovieDto();

    dto.id = 1;
    dto.title = 'Inception';
    dto.duration = 148;
    dto.url_poster = 'not-a-url';

    const errors = await validate(dto);
    const urlErrors = errors.find(error => error.property === 'url_poster');
    const constraints = urlErrors?.constraints;

    expect(urlErrors).toBeDefined();
    expect(constraints).toHaveProperty('isUrl');
  });

  it('should be invalid if rating is less than the minimum', async () => {
    const dto = new MovieDto();

    dto.id = 1;
    dto.title = 'Inception';
    dto.duration = 148;
    dto.rating = -1;

    const errors = await validate(dto);
    const ratingErrors = errors.find(error => error.property === 'rating');
    expect(ratingErrors).toBeDefined();
    expect(ratingErrors?.constraints).toHaveProperty('min');
  });

  it('should be invalid if rating is greater than the maximum', async () => {
    const dto = new MovieDto();

    dto.id = 1;
    dto.title = 'Inception';
    dto.duration = 148;
    dto.rating = 6;

    const errors = await validate(dto);
    const ratingErrors = errors.find(error => error.property === 'rating');
    expect(ratingErrors).toBeDefined();
    expect(ratingErrors?.constraints).toHaveProperty('max');
  });

  it('should be invalid if rating is not a number', async () => {
    const dto = new MovieDto();

    dto.id = 1;
    dto.title = 'Inception';
    dto.duration = 148;
    dto.rating = 'not-a-number' as unknown as number;

    const errors = await validate(dto);
    const ratingErrors = errors.find(error => error.property === 'rating');
    expect(ratingErrors).toBeDefined();
    expect(ratingErrors?.constraints).toHaveProperty('isNumber');
  });
});
