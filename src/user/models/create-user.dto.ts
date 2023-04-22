import { userRole } from './user.role';

export class CreateUserDto {
  name: string;
  username: string;
  email: string;
  password: string;
  role: userRole;
}
