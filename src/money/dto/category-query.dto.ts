import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

import { CategoryEnum } from './../../shared/enum/enums';

export class CategoryQueryDto {
  @IsOptional()
  search?: string;

  @IsNotEmpty()
  @IsEnum(CategoryEnum)
  type: CategoryEnum;
}
