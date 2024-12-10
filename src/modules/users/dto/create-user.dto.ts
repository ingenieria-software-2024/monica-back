import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { UserRole } from '../constant/users.constants';

export class CreateUserDto {
  /**
   * El nombre de usuario deberá ser único y no existir en la base de datos.
   */
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  /**
   * El email deberá ser único y no existir en la base de datos.
   */
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  /**
   * La contraseña deberá respetar las condiciones mínimas de aceptación de la verificación IsStrongPassword de "class-validator":
   *
   * - minLength: tendrá 8 caracteres como mínimo
   * - minLowercase: tendrá al menos 1 letra minúscula
   * - minUppercase: tendrá al menos 1 letra mayúscula
   * - minNumbers: tendrá al menos 1 número
   * - minSymbols: tendrá al menos 1 caracter especial
   */
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  readonly password: string;

  /**
   * Especifica un rol diferente con el cual registrar al usuario.
   *
   * Por defecto, es `USER`.
   */
  @IsString()
  @IsEnum(UserRole)
  @IsOptional()
  readonly role?: UserRole = UserRole.USER;
}
