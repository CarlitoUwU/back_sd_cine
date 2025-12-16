import { validate } from "class-validator";
import { LoginDto } from "./login.dto";

describe('LoginDto', () => {
  it('should be valid with correct data', async () => {
    const dto = new LoginDto();

    dto.email = 'jonhdoe@gmail.com';
    dto.password = 'password123@';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should be invalid if email is not present', async () => {
    const dto = new LoginDto();

    dto.password = 'password123@';

    const errors = await validate(dto);
    const emailErrors = errors.find(error => error.property === 'email');

    expect(emailErrors).toBeDefined();
  });

  it('should be invalid if email is not valid', async () => {
    const dto = new LoginDto();
    dto.email = 'invalid-email';
    dto.password = 'password123@';

    const errors = await validate(dto);
    const emailErrors = errors.find(error => error.property === 'email');

    expect(emailErrors).toBeDefined();
  });

  it('should be invalid if password is not present', async () => {
    const dto = new LoginDto();

    dto.email = 'jonhdoe@gmail.com';
    const errors = await validate(dto);
    const passwordErrors = errors.find(error => error.property === 'password');
    expect(passwordErrors).toBeDefined();
  });
});