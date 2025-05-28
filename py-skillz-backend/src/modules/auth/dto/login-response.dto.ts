import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/modules/user/entities/role.entity';

export class LoginResponseDto {
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  role: Role;
  @ApiProperty()
  token: string;
}
