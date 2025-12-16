import { validate } from "class-validator";
import { UserBaseDto } from "./user-base.dto";

describe('UserBaseDto', () => {
  it('should be valid with correct data', async () => {
    const dto = new UserBaseDto();

    dto.id = 1;
    dto.first_name = 'John';
    dto.last_name = 'Doe';
    dto.email = 'jonhdoe@gmail.com';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should be invalid if id is not present', async () => {
    const dto = new UserBaseDto();

    dto.first_name = 'John';
    dto.last_name = 'Doe';
    dto.email = 'jonhdoe@gmail.com';

    const errors = await validate(dto);
    const idErrors = errors.find(error => error.property === 'id');
    const constraints = idErrors?.constraints;

    expect(idErrors).toBeDefined();
    expect(constraints).toHaveProperty('isNotEmpty');
  });

  it('should be invalid if email is not present', async () => {
    const dto = new UserBaseDto();

    dto.id = 1;
    dto.first_name = 'John';
    dto.last_name = 'Doe';

    const errors = await validate(dto);
    const emailErrors = errors.find(error => error.property === 'email');
    const constraints = emailErrors?.constraints;

    expect(emailErrors).toBeDefined();
    expect(constraints).toHaveProperty('isNotEmpty');
  });

  it('should be invalid if first_name is not present', async () => {
    const dto = new UserBaseDto();

    dto.id = 1;
    dto.last_name = 'Doe';
    dto.email = 'jonhdoe@gmail.com';

    const errors = await validate(dto);
    const firstNameErrors = errors.find(error => error.property === 'first_name');
    const constraints = firstNameErrors?.constraints;

    expect(firstNameErrors).toBeDefined();
    expect(constraints).toHaveProperty('isNotEmpty');
  });

  it('should be invalid if last_name is not present', async () => {
    const dto = new UserBaseDto();

    dto.id = 1;
    dto.first_name = 'John';
    dto.email = 'jonhdoe@gmail.com';

    const errors = await validate(dto);
    const lastNameErrors = errors.find(error => error.property === 'last_name');
    const constraints = lastNameErrors?.constraints;

    expect(lastNameErrors).toBeDefined();
    expect(constraints).toHaveProperty('isNotEmpty');
  });
});