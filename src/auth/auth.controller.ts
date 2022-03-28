import { ResetPasswordDto } from './dto/reset-password.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegistartionDto } from './dto/registartion.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get()
  async hello(): Promise<{ message: string }> {
    return {
      message: 'Welcome to the world of NestJS!',
    };
  }
  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('/register')
  async register(@Body() registartionDto: RegistartionDto) {
    return await this.authService.register(registartionDto);
  }

  @Post('/reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }
}
