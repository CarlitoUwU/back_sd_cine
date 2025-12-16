import { validate } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

describe('CreateUserDto', () => {
  it('should be valid with correct data', async () => {
    const dto = new CreateUserDto();

    dto.first_name = 'John';
    dto.last_name = 'Doe';
    dto.email = 'jonhdoe@gmail.com';
    dto.password = 'Password123@';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should be invalid if email is not present', async () => {
    const dto = new CreateUserDto();

    dto.first_name = 'John';
    dto.last_name = 'Doe';
    dto.password = 'Password123@';

    const errors = await validate(dto);
    const emailErrors = errors.find(error => error.property === 'email');

    expect(emailErrors).toBeDefined();
  });

  it('should be invalid if password is not present', async () => {
    const dto = new CreateUserDto();

    dto.first_name = 'John';
    dto.last_name = 'Doe';
    dto.email = 'jonhdoe@gmail.com';

    const errors = await validate(dto);
    const passwordErrors = errors.find(error => error.property === 'password');

    expect(passwordErrors).toBeDefined();
  });

  it('should be invalid if first_name is not present', async () => {
    const dto = new CreateUserDto();

    dto.last_name = 'Doe';
    dto.email = 'jonhdoe@gmail.com';
    dto.password = 'Password123@';

    const errors = await validate(dto);
    const firstNameErrors = errors.find(error => error.property === 'first_name');

    expect(firstNameErrors).toBeDefined();
  });

  it('should be invalid if last_name is not present', async () => {
    const dto = new CreateUserDto();

    dto.first_name = 'Doe';
    dto.email = 'jonhdoe@gmail.com';
    dto.password = 'Password123@';

    const errors = await validate(dto);
    const lastNameErrors = errors.find(error => error.property === 'last_name');

    expect(lastNameErrors).toBeDefined();
  });
});