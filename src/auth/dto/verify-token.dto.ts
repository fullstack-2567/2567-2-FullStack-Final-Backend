import { IsString } from 'class-validator';

export class VerifyTokenDto {
  @IsString()
  access_token: string;
}
