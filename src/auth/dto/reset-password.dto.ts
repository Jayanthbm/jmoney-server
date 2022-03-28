import { IsNotEmpty } from 'class-validator';
export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  newPassword: string;
}
