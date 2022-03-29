import * as bcrypt from 'bcrypt';

import { BadRequestException, Injectable } from '@nestjs/common';

import { Category } from 'src/shared/entity/category.entity';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegistartionDto } from './dto/registartion.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from 'src/shared/entity/user.entity';
import { getConnection } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
  async getUserById(userId: number) {
    try {
      const connection = getConnection('default');
      const user = await connection.getRepository(User).findOne({
        where: { id: userId },
      });
      return user;
    } catch (error) {
      console.log('Error during get user by id', error);
      throw new BadRequestException('Error during get user by id');
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const connection = getConnection('default');
      const user = await connection.getRepository(User).findOne({
        where: { email: loginDto.email },
      });
      if (user) {
        const pass = await user.validatePassword(loginDto.password);
        const payload: JwtPayload = {
          userId: user.id,
        };
        if (pass) {
          const token = this.jwtService.sign(payload);
          const categories = await this.getUserCategories(user);
          return {
            token,
            type: 'success',
            message: 'Login Successful',
            categories,
          };
        }
      }

      throw new BadRequestException('Invalid Credentials');
    } catch (error) {
      console.log('Error during login', error);
      throw new BadRequestException(error?.message);
    }
  }

  async register(registartionDto: RegistartionDto) {
    try {
      const salt = await bcrypt.genSalt();
      const password = await this.hashPassword(registartionDto.password, salt);
      const connection = getConnection('default');
      const user = new User();
      user.name = registartionDto.name;
      user.email = registartionDto.email;
      user.phone = registartionDto.phone;
      user.password = password;
      user.salt = salt;
      await connection.manager.save(user);
      return {
        type: 'success',
        message: 'Registration successful,Please login with your credentials',
      };
    } catch (error) {
      throw new BadRequestException(
        error.code === 'ER_DUP_ENTRY'
          ? 'User already exists'
          : 'Error during registration',
      );
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const connection = getConnection('default');
      const user = await connection.getRepository(User).findOne({
        where: { email: resetPasswordDto.email },
      });
      if (user) {
        const salt = await bcrypt.genSalt();
        const password = await this.hashPassword(
          resetPasswordDto.newPassword,
          salt,
        );
        user.password = password;
        user.salt = salt;
        await connection.manager.save(user);
        return {
          view: {
            type: 'success',
            message: 'Password updated successfully',
          },
        };
      }
      throw new BadRequestException('User not found');
    } catch (error) {
      console.log('Error during reset password', error);
      throw new BadRequestException('Error during reset password');
    }
  }

  async getUserCategories(user: User) {
    try {
      const connection = getConnection('default');
      const categories = await connection.getRepository(Category).find();
      return { categories, user };
    } catch (error) {
      console.log('Error during get user categories', error);
      throw new BadRequestException('Error during get user categories');
    }
  }
}
