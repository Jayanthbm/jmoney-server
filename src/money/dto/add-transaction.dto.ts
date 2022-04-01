import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { CategoryEnum } from 'src/shared/enum/enums';

export class AddTransactionDto {
  @IsOptional()
  @IsString()
  @MaxLength(15)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsOptional()
  @IsEnum(CategoryEnum)
  type?: CategoryEnum;

  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
