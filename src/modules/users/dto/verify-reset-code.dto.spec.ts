import { validate } from 'class-validator';
import { VerifyResetCodeDto } from './verify-reset-code.dto';

describe('VerifyResetCodeDto', () => {
  it('should be valid with correct data', async () => {
    const dto = new VerifyResetCodeDto();

    dto.email = 'jonhdoe@gmail.com';
    dto.code = 123456;

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should be invalid if email is not present', async () => {
    const dto = new VerifyResetCodeDto();

    dto.code = 123456;

    const errors = await validate(dto);
    const emailErrors = errors.find(error => error.property === 'email');
    const constraints = emailErrors?.constraints;

    expect(emailErrors).toBeDefined();
    expect(constraints).toHaveProperty('isNotEmpty');
  });

  it('should be invalid if email is not valid', async () => {
    const dto = new VerifyResetCodeDto();
    dto.email = 'invalid-email';
    dto.code = 123456;

    const errors = await validate(dto);
    const emailErrors = errors.find(error => error.property === 'email');
    const constraints = emailErrors?.constraints;

    expect(emailErrors).toBeDefined();
    expect(constraints).toEqual({ isEmail: 'Please provide a valid email address' });
  });

  it('should be invalid if code is not present', async () => {
    const dto = new VerifyResetCodeDto();

    dto.email = 'jonhdoe@gmail.com';

    const errors = await validate(dto);
    const codeErrors = errors.find(error => error.property === 'code');
    const constraints = codeErrors?.constraints;

    expect(codeErrors).toBeDefined();
    expect(constraints).toHaveProperty('isNotEmpty');
  });

  it('should be invalid if code is not a number', async () => {
    const dto = new VerifyResetCodeDto();

    dto.email = 'jonhdoe@gmail.com';
    dto.code = 'not-a-number' as unknown as number;

    const errors = await validate(dto);
    const codeErrors = errors.find(error => error.property === 'code');
    const constraints = codeErrors?.constraints;

    expect(codeErrors).toBeDefined();
    expect(constraints).toHaveProperty('isNumber');
  });

  it('should be invalid if code is not a 6-digit number', async () => {
    const dto = new VerifyResetCodeDto();

    dto.email = 'jonhdoe@gmail.com';
    dto.code = 1234;

    const errors = await validate(dto);
    const codeErrors = errors.find(error => error.property === 'code');
    const constraints = codeErrors?.constraints;

    expect(codeErrors).toBeDefined();
    expect(constraints).toHaveProperty('min');
  });

  it('should be invalid if code is negative', async () => {
    const dto = new VerifyResetCodeDto();

    dto.email = 'jonhdoe@gmail.com';
    dto.code = -123456;

    const errors = await validate(dto);
    const codeErrors = errors.find(error => error.property === 'code');
    const constraints = codeErrors?.constraints;

    expect(codeErrors).toBeDefined();
    expect(constraints).toHaveProperty('isPositive');
  });
});