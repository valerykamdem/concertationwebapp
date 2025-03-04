import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../services/account.service';
import { UserService } from '../../../services/user.service';
import { OperationService } from '../../../services/operation.service';
import { Account } from '../../../models/account.model';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiResponse } from '../../../interfaces/api-response';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { User } from '../../../models/user.model';
import { ButtonModule } from 'primeng/button';
import { Operation } from '../../../models/operation.model';
import {OperationComponent} from "../operation/operation.component";

@Component({
    selector: 'app-dashboard',
  imports: [
    AvatarModule,
    ButtonModule,
    CardModule,
    CommonModule,
    PaginatorModule,
    TableModule,
    OperationComponent,
  ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  userService = inject(UserService);
  accountService = inject(AccountService);
  operationService = inject(OperationService);
  user = signal<User | null | undefined>(undefined);
  accounts = signal<Account[] | null | undefined>(undefined);
  balanceTotal = 0;
  operations: Operation[] = [];
  selectedAccount: Account | undefined;
  isActive = false; // État initial

  constructor(
    private route: ActivatedRoute,
    private router: Router) { }

  async ngOnInit() {
    this.getUser();
    this.getAccounts();
  }

  getUser(): void {
    this.userService.getUser()
    .subscribe((response: ApiResponse<User | null | undefined>) => {
      if(response.isSuccess){
        this.user.set(response.value);
      }
    });
  }

  getAccounts(): void {
    this.accountService.getUserAccountWithOperations()
      .subscribe((response: ApiResponse<Account[] | null>) => {
        if(response.isSuccess){
          this.accounts.set(response.value);
          this.balanceTotal = response.value!.reduce((accumulateur, account) => accumulateur + account.balance, 0);
        }
      });
  }

  navigateToAccount() {
    this.router.navigate(['/accounts']);
  }

  onSelect(account: Account): void {
    if(this.selectedAccount?.accountType === account.accountType){
      this.isActive = !this.isActive;
        this.selectedAccount = undefined;
        // console.log("select equals", this.isActive);
    }else{
      this.isActive = !this.isActive;
      this.selectedAccount = account;
      this.operations = account.operations;
      // console.log("onSelect", this.isActive);
  }

}

  goToTransaction(operation: string): void {
    switch (operation) {
      case 'transfer':
        this.router.navigate(['/transfer']);
        break;
      case 'deposit':
        this.router.navigate(['/deposit']);
        break;
      case 'withdrawal':
        this.router.navigate(['/withdrawal']);
        break;
      default:
        console.log('Default action');
        break;
    }
  }

}
