import { validate } from "class-validator";
import { ResetPasswordDto } from "./reset-password.dto";

describe('ResetPasswordDto', () => {
  it('should be valid with correct data', async () => {
    const dto = new ResetPasswordDto();

    dto.email = 'jonhdoe@gmail.com';
    dto.newPassword = 'NewPassword123@';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should be invalid if email is not present', async () => {
    const dto = new ResetPasswordDto();

    dto.newPassword = 'NewPassword123@';

    const errors = await validate(dto);
    const emailErrors = errors.find(error => error.property === 'email');

    expect(emailErrors).toBeDefined();
  });

  it('should be invalid if email is not valid', async () => {
    const dto = new ResetPasswordDto();
    dto.email = 'invalid-email';
    dto.newPassword = 'NewPassword123@';

    const errors = await validate(dto);
    const emailErrors = errors.find(error => error.property === 'email');

    expect(emailErrors).toBeDefined();
  });

  it('should be invalid if newPassword is not present', async () => {
    const dto = new ResetPasswordDto();

    dto.email = 'jonhdoe@gmail.com';
    const errors = await validate(dto);
    const passwordErrors = errors.find(error => error.property === 'newPassword');
    expect(passwordErrors).toBeDefined();
  });
});