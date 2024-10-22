import { IsInt, IsNotEmpty } from 'class-validator';

export class AssignSizeDto {
  @IsNotEmpty()
  @IsInt()
  sizeId: number;
}
