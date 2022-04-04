import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class AddUserGoalDto {
  @IsOptional()
  userGoalId?: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;

  @IsNotEmpty()
  @IsNumber()
  savedAmount: number;
}
