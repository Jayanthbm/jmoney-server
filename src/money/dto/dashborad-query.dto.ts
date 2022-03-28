import { IsOptional } from 'class-validator';

export class DashboardQueryDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  pageSize?: number;
}
