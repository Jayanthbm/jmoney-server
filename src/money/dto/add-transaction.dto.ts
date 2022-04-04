import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { CategoryEnum } from 'src/shared/enum/enums';

export class AddTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(CategoryEnum)
  type?: CategoryEnum;

  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
