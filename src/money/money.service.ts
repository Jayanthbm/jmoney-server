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
import { getConnection } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class MoneyService {
  async getDashboard(user: User, dashboardQuery: DashboardQueryDto) {
    try {
      return {
        user,
        dashboardQuery,
      };
    } catch (error) {
      console.log('Error during fetching dashboard data ', error);
      throw new BadRequestException('Error during fetching dashboard data');
    }
  }
  async getCategories(user: User, categoryQuery: CategoryQueryDto) {
    try {
      const connection = getConnection('default');
      let query;
      const { search } = categoryQuery;
      let { page, pageSize } = categoryQuery;
      page = page || 1;
      pageSize = pageSize || 10;
      query = connection
        .getRepository(Category)
        .createQueryBuilder('category')
        .where('category.userId = :userId', { userId: user.id });
      if (search && search.length > 0) {
        query = query.andWhere('category.name LIKE :search', {
          search: `%${search}%`,
        });
      }
      query.orderBy('category.name', 'ASC');
      return await paginate<Category>(query, {
        page,
        limit: pageSize,
      });
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
      category.icon = addCategoryDto.icon;
      category.type = addCategoryDto.type;
      category.user = user;
      await connection.manager.save(category);
      return {
        view: {
          type: 'success',
          message: 'Category added successfully',
        },
      };
    } catch (error) {
      console.log('Error during adding category ', error);
      throw new BadRequestException('Error during adding category');
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
      category.icon = addCategoryDto.icon;
      category.type = addCategoryDto.type;
      await connection.manager.save(category);
      return {
        view: {
          type: 'success',
          message: 'Category updated successfully',
        },
      };
    } catch (error) {
      console.log('Error during updating category ', error);
      throw new BadRequestException('Error during updating category');
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
        view: {
          type: 'success',
          message: 'Category deleted successfully',
        },
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
      pageSize = pageSize || 10;
      const query = connection
        .getRepository(UserTransactions)
        .createQueryBuilder('transaction')
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
      transaction.name = addTransactionDto.name;
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
      // transaction.user = user;
      await connection.manager.save(transaction);
      return {
        view: {
          type: 'success',
          message: 'Transaction added successfully',
        },
      };
    } catch (error) {
      console.log('Error during adding transaction ', error);
      throw new BadRequestException('Error during adding transaction');
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
      transaction.name = addTransactionDto.name;
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
        view: {
          type: 'success',
          message: 'Transaction updated successfully',
        },
      };
    } catch (error) {
      console.log('Error during updating transaction ', error);
      throw new BadRequestException('Error during updating transaction');
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
        view: {
          type: 'success',
          message: 'Transaction deleted successfully',
        },
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
      let { page, pageSize } = userGoalsQuery;
      page = page || 1;
      pageSize = pageSize || 10;
      const userGoals = connection
        .getRepository(UserGoals)
        .createQueryBuilder('userGoal')
        .where('userGoal.userId = :userId', { userId: user.id });
      if (search && search.length > 0) {
        userGoals.andWhere('userGoal.name like :search', {
          search: `%${search}%`,
        });
        return await paginate<UserGoals>(userGoals, {
          page,
          limit: pageSize,
        });
      }
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
      userGoal.description = addUserGoalDto.description;
      userGoal.totalAmount = addUserGoalDto.totalAmount;
      userGoal.savedAmount = addUserGoalDto.savedAmount;
      userGoal.user = user;
      await connection.manager.save(userGoal);
      return {
        view: {
          type: 'success',
          message: 'User goal added successfully',
        },
      };
    } catch (error) {
      console.log('Error during adding user goal ', error);
      throw new BadRequestException('Error during adding user goal');
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
      userGoal.icon = addUserGoalDto.icon;
      userGoal.description = addUserGoalDto.description;
      userGoal.totalAmount = addUserGoalDto.totalAmount;
      userGoal.savedAmount = addUserGoalDto.savedAmount;
      await connection.manager.save(userGoal);
      return {
        view: {
          type: 'success',
          message: 'User goal updated successfully',
        },
      };
    } catch (error) {
      console.log('Error during updating user goal ', error);
      throw new BadRequestException('Error during updating user goal');
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
        view: {
          type: 'success',
          message: 'User goal deleted successfully',
        },
      };
    } catch (error) {
      console.log('Error during deleting user goal ', error);
      throw new BadRequestException('Error during deleting user goal');
    }
  }
}
