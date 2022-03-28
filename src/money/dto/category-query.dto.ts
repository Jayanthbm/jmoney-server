import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

import { CategoryEnum } from './../../shared/enum/enums';

export class CategoryQueryDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  pageSize?: number;

  @IsNotEmpty()
  @IsEnum(CategoryEnum)
  type: CategoryEnum;
}
