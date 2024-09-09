import { Component, inject, signal } from '@angular/core';
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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule, 
    AvatarModule,
    RouterLink,
    RouterOutlet,
    PaginatorModule,
    TableModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  userService = inject(UserService);
  user = this.userService.getUser(); //signal<User | null | undefined>(undefined);
  accounts = signal<Account[] | null | undefined>(undefined);
  balanceTotal = 0;

  constructor(private accountService: AccountService,
    private operationService: OperationService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.getAccount(); 
  }

  loadAccounts(): void {
     this.accountService.getAccounts().subscribe((response: ApiResponses<Account>) => {
      if(response.isSuccess){
        this.accounts.set(response.value);
        console.log(this.accounts());
      }     
    }); 
  }

  getAccount(): void {
    this.accountService.getAccount(this.user()?.id!)
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

  // getSeverity(status: string) {
  //   switch (status) {
  //       case 'unqualified':
  //           return 'danger';

  //       case 'qualified':
  //           return 'success';

  //       case 'new':
  //           return 'info';

  //       case 'negotiation':
  //           return 'warning';

  //       case 'renewal':
  //           return null;
  //   }
  // }

}
