import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

/**
 * Pipe que valida que el query parameter provisto sea positivo y entero.
 *
 * En caso de que se desee sea opcional, se puede parsear como `new PositiveIntegerPipe(true)`.
 * Si está marcado como opcional y no hay valor presente, retorna `undefined`.
 *
 * @pipe
 */
export class PositiveIntegerPipe implements PipeTransform<string> {
  readonly #isOptional: boolean;

  constructor(isOptional?: boolean) {
    this.#isOptional = isOptional;
  }

  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata?.type !== 'query') return value;

    if (this.#isOptional && !value) return undefined;

    // Parsear el valor a entero
    const intValue = +value;

    if (Number.isNaN(intValue) || intValue < 0 || !Number.isInteger(intValue))
      throw new BadRequestException(
        `El valor de '${metadata?.data ?? 'parametro'}' debe ser un número entero positivo.`,
      );

    return intValue;
  }
}
