import { Role } from 'src/modules/user/entities/role.entity';

export class PayloadDto {
  sub: string;
  email: string;
  username: string;
  role: Role;
}
