import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MoneyModule } from './money/money.module';

@Module({
  imports: [AuthModule, MoneyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
