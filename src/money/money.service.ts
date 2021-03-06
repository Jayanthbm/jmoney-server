import { BadRequestException, Injectable } from '@nestjs/common';

import { AddCategoryDto } from './dto/add-category.dto';
import { AddTransactionDto } from './dto/add-transaction.dto';
import { AddUserGoalDto } from './dto/add-user-goal.dto';
import { Category } from './../shared/entity/category.entity';
import { CategoryQueryDto } from './dto/category-query.dto';
import { DashboardQueryDto } from './dto/dashborad-query.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { User } from 'src/shared/entity/user.entity';
import { UserGoals } from './../shared/entity/user-goals.entity';
import { UserGoalsQueryDto } from './dto/user-goals-query.dto';
import { UserTransactions } from './../shared/entity/user-transactions.entity';
import { CategoryEnum } from './../shared/enum/enums';
import { getConnection } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
// import { faker } from '@faker-js/faker';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require('moment');
// function randomIntFromInterval(min, max) {
//   // min and max included
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }
@Injectable()
export class MoneyService {
  async getDashboard(user: User, dashboardQuery: DashboardQueryDto) {
    try {
      const availableBalance = await this.getAvailableBalance(user);
      const dailyLimit = await this.getDailyLimit(user);
      const monthsTotalIncome = await this.getMonthsTotalIncome(user);
      const monthsTotalExpense = await this.getMonthsTotalExpense(user);
      const month = moment().format('MMMM');
      const year = moment().format('YYYY');
      // Start date and End date of the month
      const startDate = moment().clone().startOf('month').format('DD-MM-YYYY');
      const endDate = moment().clone().endOf('month').format('DD-MM-YYYY');
      return {
        month,
        year,
        startDate,
        endDate,
        availableBalance,
        dailyLimit,
        monthsTotalIncome,
        monthsTotalExpense,
      };
    } catch (error) {
      console.log('Error during fetching dashboard data ', error);
      throw new BadRequestException('Error during fetching dashboard data');
    }
  }

  async getCategories(user: User, categoryQuery: CategoryQueryDto) {
    try {
      const connection = getConnection('default');
      const { search, type } = categoryQuery;
      const query = connection
        .getRepository(Category)
        .createQueryBuilder('category')
        .where('category.userId = :userId', { userId: user.id });
      if (search && search.length > 0) {
        query.andWhere('category.name LIKE :search', {
          search: `%${search}%`,
        });
      }
      if (type) {
        query.andWhere('category.type = :type', { type });
      }
      let incomeCategories, expenseCategories;
      if (!type) {
        const incomeQuery = query.clone();

        incomeQuery.andWhere('category.type = :type', {
          type: CategoryEnum.income,
        });
        incomeCategories = await incomeQuery.getMany();
        const expenseQuery = query.clone();
        expenseQuery.andWhere('category.type = :type', {
          type: CategoryEnum.expense,
        });
        expenseCategories = await expenseQuery.getMany();
      }
      query.orderBy('category.name', 'ASC');
      return {
        incomeCategories,
        expenseCategories,
        categories: await query.getMany(),
      };
    } catch (error) {
      console.log('Error during fetching categories ', error);
      throw new BadRequestException('Error during fetching categories');
    }
  }

  async addCategory(user: User, addCategoryDto: AddCategoryDto) {
    try {
      const connection = getConnection('default');
      const category = new Category();
      category.name = addCategoryDto.name;
      category.type = addCategoryDto.type;
      category.user = user;
      await connection.manager.save(category);
      return {
        type: 'success',
        message: 'Category added successfully',
      };
    } catch (error) {
      console.log('Error during adding category ', error);
      throw new BadRequestException(
        error.code === 'ER_DUP_ENTRY'
          ? 'Category already exists'
          : 'Error during adding category',
      );
    }
  }

  async updateCategory(
    user: User,
    categoryId: number,
    addCategoryDto: AddCategoryDto,
  ) {
    try {
      const connection = getConnection('default');
      const category = await connection.getRepository(Category).findOne({
        where: { id: categoryId },
      });
      if (!category) {
        throw new BadRequestException('Category not found');
      }
      category.name = addCategoryDto.name;
      category.type = addCategoryDto.type;
      await connection.manager.save(category);
      return {
        type: 'success',
        message: 'Category updated successfully',
      };
    } catch (error) {
      console.log('Error during updating category ', error);
      throw new BadRequestException(
        error.code === 'ER_DUP_ENTRY'
          ? 'Category already exists'
          : 'Error during updating category',
      );
    }
  }

  async deleteCategory(user: User, categoryId: number) {
    try {
      const connection = getConnection('default');
      const category = await connection.getRepository(Category).findOne({
        where: { id: categoryId },
      });
      if (!category) {
        throw new BadRequestException('Category not found');
      }
      await connection.manager.remove(category);
      return {
        type: 'success',
        message: 'Category deleted successfully',
      };
    } catch (error) {
      console.log('Error during deleting category ', error);
      throw new BadRequestException('Error during deleting category');
    }
  }

  async getTransactions(user: User, transactionQuery: TransactionQueryDto) {
    try {
      const connection = getConnection('default');
      const { search } = transactionQuery;
      let { page, pageSize } = transactionQuery;
      page = page || 1;
      pageSize = pageSize || 20;
      const query = connection
        .getRepository(UserTransactions)
        .createQueryBuilder('transaction')
        .leftJoinAndSelect('transaction.category', 'category')
        .where('transaction.userId = :userId', { userId: user.id });
      if (search && search.length > 0) {
        query.andWhere('transaction.description LIKE :search', {
          search: `%${search}%`,
        });
      }
      if (transactionQuery.type) {
        query.andWhere('transaction.type = :type', {
          type: transactionQuery.type,
        });
      }
      if (transactionQuery.categoryId) {
        query.andWhere('transaction.categoryId = :categoryId', {
          categoryId: transactionQuery.categoryId,
        });
      }
      if (transactionQuery.startDate && transactionQuery.endDate) {
        query.andWhere('transaction.date BETWEEN :startDate AND :endDate', {
          startDate: transactionQuery.startDate,
          endDate: transactionQuery.endDate,
        });
      }
      if (transactionQuery.month) {
        let year = transactionQuery.year;
        if (!year) {
          year = moment().format('YYYY');
        }
        query
          .andWhere('month(transaction.date) = :month', {
            month: transactionQuery.month,
          })
          .andWhere('YEAR(transaction.date) = :year', {
            year: year,
          });
      }
      if (transactionQuery.year) {
        query.andWhere('YEAR(transaction.date) = :year', {
          year: transactionQuery.year,
        });
      }
      return await paginate<UserTransactions>(query, {
        page,
        limit: pageSize,
      });
    } catch (error) {
      console.log('Error during fetching transactions data ', error);
      throw new BadRequestException('Error during fetching transactions data');
    }
  }

  async addTransaction(user: User, addTransactionDto: AddTransactionDto) {
    try {
      const connection = getConnection('default');
      const transaction = new UserTransactions();
      transaction.description = addTransactionDto.description;
      transaction.amount = addTransactionDto.amount;
      if (addTransactionDto.type) {
        transaction.type = addTransactionDto.type;
      }
      if (addTransactionDto.categoryId) {
        const category = await connection.getRepository(Category).findOne({
          where: { id: addTransactionDto.categoryId },
        });
        if (category) {
          transaction.category = category;
        }
      }
      transaction.user = user;
      await connection.manager.save(transaction);
      return {
        type: 'success',
        message: 'Transaction added successfully',
      };
    } catch (error) {
      console.log('Error during adding transaction ', error);
      throw new BadRequestException(
        error.code === 'ER_DUP_ENTRY'
          ? 'Transaction already exists'
          : 'Error during adding transaction',
      );
    }
  }

  async updateTransaction(
    user: User,
    transactionId: number,
    addTransactionDto: AddTransactionDto,
  ) {
    try {
      const connection = getConnection('default');
      const transaction = await connection
        .getRepository(UserTransactions)
        .findOne({
          where: { id: transactionId },
        });
      if (!transaction) {
        throw new BadRequestException('Transaction not found');
      }
      transaction.description = addTransactionDto.description;
      transaction.amount = addTransactionDto.amount;
      if (addTransactionDto.type) {
        transaction.type = addTransactionDto.type;
      }
      if (addTransactionDto.categoryId) {
        const category = await connection.getRepository(Category).findOne({
          where: { id: addTransactionDto.categoryId },
        });
        if (category) {
          transaction.category = category;
        }
      }
      await connection.manager.save(transaction);
      return {
        type: 'success',
        message: 'Transaction updated successfully',
      };
    } catch (error) {
      console.log('Error during updating transaction ', error);
      throw new BadRequestException(
        error.code === 'ER_DUP_ENTRY'
          ? 'Transaction already exists'
          : 'Error during updating transaction',
      );
    }
  }

  async deleteTransaction(user: User, transactionId: number) {
    try {
      const connection = getConnection('default');
      const transaction = await connection
        .getRepository(UserTransactions)
        .findOne({
          where: { id: transactionId },
        });
      if (!transaction) {
        throw new BadRequestException('Transaction not found');
      }
      await connection.manager.remove(transaction);
      return {
        type: 'success',
        message: 'Transaction deleted successfully',
      };
    } catch (error) {
      console.log('Error during deleting transaction ', error);
      throw new BadRequestException('Error during deleting transaction');
    }
  }

  async getUserGoals(user: User, userGoalsQuery: UserGoalsQueryDto) {
    try {
      const connection = getConnection('default');
      const { search } = userGoalsQuery;
      const userGoals = connection
        .getRepository(UserGoals)
        .createQueryBuilder('userGoal')
        .where('userGoal.userId = :userId', { userId: user.id });
      if (search && search.length > 0) {
        userGoals.andWhere('userGoal.name like :search', {
          search: `%${search}%`,
        });
      }
      userGoals.orderBy('userGoal.id', 'DESC');
      return await userGoals.getMany();
    } catch (error) {
      console.log('Error during fetching user goals ', error);
      throw new BadRequestException('Error during fetching user goals');
    }
  }

  async addUserGoal(user: User, addUserGoalDto: AddUserGoalDto) {
    try {
      const connection = getConnection('default');
      const userGoal = new UserGoals();
      userGoal.name = addUserGoalDto.name;
      userGoal.totalAmount = addUserGoalDto.totalAmount;
      userGoal.savedAmount = addUserGoalDto.savedAmount;
      userGoal.user = user;
      await connection.manager.save(userGoal);
      return {
        type: 'success',
        message: 'User goal added successfully',
      };
    } catch (error) {
      console.log('Error during adding user goal ', error);
      throw new BadRequestException(
        error.code === 'ER_DUP_ENTRY'
          ? 'User Goal already exists'
          : 'Error during adding user goal',
      );
    }
  }

  async updateUserGoal(
    user: User,
    userGoalId: number,
    addUserGoalDto: AddUserGoalDto,
  ) {
    try {
      const connection = getConnection('default');
      const userGoal = await connection.getRepository(UserGoals).findOne({
        where: { id: userGoalId },
      });
      if (!userGoal) {
        throw new BadRequestException('User goal not found');
      }
      userGoal.name = addUserGoalDto.name;
      userGoal.totalAmount = addUserGoalDto.totalAmount;
      userGoal.savedAmount = addUserGoalDto.savedAmount;
      await connection.manager.save(userGoal);
      return {
        type: 'success',
        message: 'User goal updated successfully',
      };
    } catch (error) {
      console.log('Error during updating user goal ', error);
      throw new BadRequestException(
        error.code === 'ER_DUP_ENTRY'
          ? 'User Goal already exists'
          : 'Error during updating user goal',
      );
    }
  }

  async deleteUserGoal(user: User, userGoalId: number) {
    try {
      const connection = getConnection('default');
      const userGoal = await connection.getRepository(UserGoals).findOne({
        where: { id: userGoalId },
      });
      if (!userGoal) {
        throw new BadRequestException('User goal not found');
      }
      await connection.manager.remove(userGoal);
      return {
        type: 'success',
        message: 'User goal deleted successfully',
      };
    } catch (error) {
      console.log('Error during deleting user goal ', error);
      throw new BadRequestException('Error during deleting user goal');
    }
  }

  async getTotalIncomeExpense(
    type: CategoryEnum,
    user: User,
    month: number,
    year: number,
  ) {
    try {
      const connection = getConnection('default');
      const query = await connection
        .getRepository(UserTransactions)
        .createQueryBuilder('trans')
        .select('SUM(amount) as total')
        .where('trans.userId = :userId', { userId: user.id });

      if (type) {
        query.andWhere('trans.type =:type', { type });
      }

      if (month && year) {
        query
          .andWhere('MONTH(trans.date) = :month', { month })
          .andWhere('YEAR(trans.date) = :year', { year });
      }
      const result = await query.getRawOne();
      return result.total;
    } catch (error) {}
  }

  async getAvailableBalance(user: User) {
    try {
      return {
        total: 6000,
      };
    } catch (error) {
      console.log('Error while fetching Available Balance');
    }
  }
  async getDailyLimit(user: User) {
    try {
      return {
        total: 200,
        spentToday: 50,
        remaingForTheeDay: 150,
      };
    } catch (error) {
      console.log('Error while fetching Daily Limit');
    }
  }
  async getMonthsTotalIncome(user: User) {
    try {
      return {
        total: 50000,
        lastMonthIncome: 52000,
        comparedToLastMonthInPercent: (52000 / 50000 / 50000) * 100,
        comparedToLastMonthInMoney: 52000 - 50000,
      };
    } catch (error) {
      console.log('Error while fetching Months total Income');
    }
  }
  async getMonthsTotalExpense(user: User) {
    try {
      return {
        total: 15000,
        lastMonthExpense: 12000,
        comparedToLastMonthInPercent: (12000 / 15000 / 15000) * 100,
        comparedToLastMonthInMoney: 12000 - 15000,
      };
    } catch (error) {
      console.log('Error while fetching Months total Expense');
    }
  }
}
