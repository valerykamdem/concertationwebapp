import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../services/account.service';
import { UserService } from '../../../services/user.service';
import { OperationService } from '../../../services/operation.service';
import { Account } from '../../../models/account.model';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { Router, RouterLink, RouterOutlet, ActivatedRoute } from '@angular/router';
import { ApiResponse, ApiResponses } from '../../../interfaces/api-response';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { User } from '../../../models/user.model';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { Operation } from '../../../models/operation.model';

@Component({
    selector: 'app-transfert',
    imports: [
      ButtonModule,     
      CardModule,
      FormsModule,
      Select],
    templateUrl: './transfert.component.html',
    styleUrl: './transfert.component.css'
})
export class TransfertComponent implements OnInit {

  userService = inject(UserService);
  accountService = inject(AccountService);
  operationService = inject(OperationService);

  accounts = signal<Account[] | undefined>(undefined);
  operations: Operation[] = [];
  selectedAccount: Account | undefined;
  balanceTotal = 0;

  async ngOnInit() {
    this.getAccounts();
  }

  getAccounts(): void {
    this.accountService.getUserAccountWithOperations()
      .subscribe((response: ApiResponses<Account>) => {
        if(response.isSuccess){
          this.accounts.set(response.value);
          this.balanceTotal = response.value.reduce((accumulateur, account) => accumulateur + account.balance, 0);
        }
      });
  }

  onSelect(account: Account): void {
  //   if(this.selectedAccount?.accountType === account.accountType){
  //     this.isActive = !this.isActive;
  //       this.selectedAccount = undefined;
  //       console.log("select equals", this.isActive);
  //   }else{
  //     this.isActive = !this.isActive;
  //     this.selectedAccount = account;
  //     this.operations = account.operations;
       console.log("onSelect", account);
   }

   onChange(event: any): void {
    // console.log("onChange", event.value);
      //this.operations = event.value.operations;
  }

}
