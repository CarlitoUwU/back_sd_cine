import { validate } from "class-validator";
import { CreateResetPasswordDto } from "./create-reset-password.dto";

describe('CreateResetPasswordDto', () => {
  it('should be valid with correct data', async () => {
    const dto = new CreateResetPasswordDto();

    dto.email = 'jonhdoe@gmail.com';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should be invalid if email is not present', async () => {
    const dto = new CreateResetPasswordDto();

    const errors = await validate(dto);
    const emailErrors = errors.find(error => error.property === 'email');
    const constraints = emailErrors?.constraints;

    expect(emailErrors).toBeDefined();
    expect(constraints).toHaveProperty('isNotEmpty');
  });

  it('should be invalid if email is not valid', async () => {
    const dto = new CreateResetPasswordDto();

    dto.email = 'invalid-email';

    const errors = await validate(dto);
    const emailErrors = errors.find(error => error.property === 'email');
    const constraints = emailErrors?.constraints;

    expect(emailErrors).toBeDefined();
    expect(constraints).toEqual({ isEmail: 'Please provide a valid email address' });
  });
});