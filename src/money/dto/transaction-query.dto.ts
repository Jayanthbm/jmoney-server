import { IsEnum, IsNumber, IsOptional } from 'class-validator';

import { CategoryEnum } from 'src/shared/enum/enums';

export class TransactionQueryDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  pageSize?: number;

  @IsOptional()
  @IsEnum(CategoryEnum)
  type?: CategoryEnum;

  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
