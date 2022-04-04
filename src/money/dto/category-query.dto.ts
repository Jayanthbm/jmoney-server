import { IsEnum, IsOptional } from 'class-validator';

import { CategoryEnum } from './../../shared/enum/enums';

export class CategoryQueryDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  @IsEnum(CategoryEnum)
  type: CategoryEnum;
}
