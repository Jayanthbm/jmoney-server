import { IsOptional } from 'class-validator';

export class UserGoalsQueryDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  pageSize?: number;
}
