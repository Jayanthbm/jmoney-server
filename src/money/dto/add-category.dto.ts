import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { CategoryEnum } from 'src/shared/enum/enums';

export class AddCategoryDto {
  @IsOptional()
  categoryId?: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  name: string;

  @IsNotEmpty()
  @IsEnum(CategoryEnum)
  type: CategoryEnum;
}
