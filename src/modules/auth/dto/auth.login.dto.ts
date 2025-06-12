import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
  /** El nombre de usuario o correo electronico del usuario. */
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  username: string;

  /** La contraseña del usuario en texto plano. */
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  password: string;
}
