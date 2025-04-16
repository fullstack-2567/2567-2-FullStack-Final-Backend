import { User } from 'src/entities/user.entity';

export class MeDto {
  success: string;
  data: User;
}
