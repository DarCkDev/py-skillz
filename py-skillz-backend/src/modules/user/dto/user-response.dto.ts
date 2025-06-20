import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../entities/role.entity';

export class UserResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  role: Role;
  @ApiProperty()
  createdAt?: Date;
  @ApiProperty()
  updatedAt?: Date;
}
