import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthRecoveryDto {
  /** El correo electronico de la cuenta. */
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @IsDefined()
  email: string;
}
