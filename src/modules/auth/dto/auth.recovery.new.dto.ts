import {
  IsString,
  IsNotEmpty,
  IsDefined,
  Validate,
  IsStrongPassword,
} from 'class-validator';

export class AuthRecoveryNewDto {
  /** El código OTP que autoriza este cambio de contraseña. */
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Validate((value: string) => /([A-Z0-9]){4}/g.test(value), {
    message: 'El código es inválido.',
  })
  code: string;

  /** La nueva contraseña del usuario. */
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}
