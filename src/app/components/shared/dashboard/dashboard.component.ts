import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
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
import { Operation } from '../../../models/operation.model';

@Component({
    selector: 'app-dashboard',
    imports: [
      AvatarModule,
      ButtonModule,     
      CardModule,
      CommonModule,
      PaginatorModule,
      TableModule,
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  userService = inject(UserService);
  accountService = inject(AccountService);
  operationService = inject(OperationService);
  user = signal<User | null | undefined>(undefined);
  // accounts: WritableSignal<Account[]> = signal<Account[]>([]);
  accounts = signal<Account[] | null | undefined>(undefined);
  balanceTotal = 0;
  operations: Operation[] = [];
  selectedAccount?: Account;//Account | undefined;
  isActive = false; // État initial

  constructor(
    private route: ActivatedRoute,
    private router: Router) { }

  async ngOnInit() {
    this.user.set(await this.userService.getUser());
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

  goToOperation(account: Account) {
    this.router.navigate(['/operations/', account.id]);
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

  getSeverity(status: string) {
    switch (status) {
        case 'unqualified':
            return 'danger';

        case 'qualified':
            return 'success';

        case 'new':
            return 'info';

        case 'negotiation':
            return 'warning';

        case 'renewal':
            return null;
    }
    return status;
  }

  goToTransfert(): void {
    this.router.navigate(['/transfert']);
  }

}
