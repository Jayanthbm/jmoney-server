import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class AddUserGoalDto {
  @IsOptional()
  userGoalId?: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;

  @IsNotEmpty()
  @IsNumber()
  savedAmount: number;
}
