import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { UserRole } from '../constant/users.constants';

export class UpdateUserDto {
  /** Si se especifica, cambia el correo electronico de un usuario. */
  @IsString()
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  /** Si se especifica, cambia el nombre de usuario de un usuario. */
  @IsString()
  @IsOptional()
  readonly username?: string;

  /** Si se especifica, cambia la contraseña de un usuario. */
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @IsOptional()
  readonly password?: string;

  /**
   * Si se especifica, cambia el rol de un usuario.
   *
   * Este valor solo puede ser cambiado por un usuario con rol `ADMIN`.
   */
  @IsString()
  @IsEnum(UserRole)
  @IsOptional()
  readonly role?: UserRole;
}
