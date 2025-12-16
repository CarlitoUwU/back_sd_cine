import { OmitType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UserBaseDto extends OmitType(UserDto, ['password'] as const) { }
