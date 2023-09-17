import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';
import { EmployeesModule } from './employees/employees.module';
import { BranchesModule } from './branches/branches.module';

@Module({
  imports: [ClientsModule, AccountsModule, TransactionsModule, EmployeesModule, BranchesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
