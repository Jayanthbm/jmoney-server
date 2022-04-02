import { IsOptional } from 'class-validator';

export class UserGoalsQueryDto {
  @IsOptional()
  search?: string;
}
