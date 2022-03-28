import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AddCategoryDto } from './dto/add-category.dto';
import { AddTransactionDto } from './dto/add-transaction.dto';
import { AddUserGoalDto } from './dto/add-user-goal.dto';
import { CategoryQueryDto } from './dto/category-query.dto';
import { DashboardQueryDto } from './dto/dashborad-query.dto';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { MoneyService } from './money.service';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { UserGoalsQueryDto } from './dto/user-goals-query.dto';

@UseGuards(JwtAuthGuard)
@Controller('money')
export class MoneyController {
  constructor(private readonly moneyService: MoneyService) {}
  @Get('/dashboard')
  async getDashboard(@Req() req, @Query() dashboardQuery: DashboardQueryDto) {
    return this.moneyService.getDashboard(req.user, dashboardQuery);
  }

  @Get('/getCategories')
  async getCategories(@Req() req, @Query() categoryQuery: CategoryQueryDto) {
    return this.moneyService.getCategories(req.user, categoryQuery);
  }

  @Post('/addCategory')
  async addCategory(@Req() req, @Body() addCategoryDto: AddCategoryDto) {
    return this.moneyService.addCategory(req.user, addCategoryDto);
  }

  @Patch('/updateCategory/:categoryId')
  async updateCategory(
    @Req() req,
    @Param('categoryId') categoryId: number,
    @Body() addCategoryDto: AddCategoryDto,
  ) {
    return this.moneyService.updateCategory(
      req.user,
      categoryId,
      addCategoryDto,
    );
  }

  @Delete('/deleteCategory/:categoryId')
  async deleteCategory(@Req() req, @Param('categoryId') categoryId: number) {
    return this.moneyService.deleteCategory(req.user, categoryId);
  }

  @Get('/transactions')
  async getTransactions(
    @Req() req,
    @Query() transactionQuery: TransactionQueryDto,
  ) {
    return this.moneyService.getTransactions(req.user, transactionQuery);
  }

  @Post('/addTransaction')
  async addTransaction(
    @Req() req,
    @Body() addTransactionDto: AddTransactionDto,
  ) {
    return this.moneyService.addTransaction(req.user, addTransactionDto);
  }

  @Patch('/updateTransaction/:transactionId')
  async updateTransaction(
    @Req() req,
    @Param('transactionId') transactionId: number,
    @Body() addTransactionDto: AddTransactionDto,
  ) {
    return this.moneyService.updateTransaction(
      req.user,
      transactionId,
      addTransactionDto,
    );
  }

  @Delete('/deleteTransaction/:transactionId')
  async deleteTransaction(
    @Req() req,
    @Param('transactionId') transactionId: number,
  ) {
    return this.moneyService.deleteTransaction(req.user, transactionId);
  }

  @Get('/user-goals')
  async getUserGoals(@Req() req, @Query() userGoalsQuery: UserGoalsQueryDto) {
    return this.moneyService.getUserGoals(req.user, userGoalsQuery);
  }

  @Post('/addUserGoal')
  async addUserGoal(@Req() req, @Body() addUserGoalDto: AddUserGoalDto) {
    return this.moneyService.addUserGoal(req.user, addUserGoalDto);
  }

  @Patch('/updateUserGoal/:userGoalId')
  async updateUserGoal(
    @Req() req,
    @Param('userGoalId') userGoalId: number,
    @Body() addUserGoalDto: AddUserGoalDto,
  ) {
    return this.moneyService.updateUserGoal(
      req.user,
      userGoalId,
      addUserGoalDto,
    );
  }

  @Delete('/deleteUserGoal/:userGoalId')
  async deleteUserGoal(@Req() req, @Param('userGoalId') userGoalId: number) {
    return this.moneyService.deleteUserGoal(req.user, userGoalId);
  }
}
