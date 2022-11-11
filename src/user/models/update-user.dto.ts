import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { userRole } from './user.role';

export class UpdateUserDto {
  name: string;
  username: string;
  email: string;
  password: string;
}
