import { IsInt, IsNotEmpty } from 'class-validator';

export class AssignColorDto {
  @IsNotEmpty()
  @IsInt()
  colorId: number;
}
