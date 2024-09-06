import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../services/account.service';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { OperationService } from '../../../services/operation.service';
import { User } from '../../../models/user.model';
import { Account } from '../../../models/account.model';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { Router, RouterLink } from '@angular/router';
import { ApiResponse, ApiResponses } from '../../../interfaces/api-response';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule, 
    AvatarModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  userService = inject(UserService);
  user = this.userService.getUser(); //signal<User | null | undefined>(undefined);
  accounts = signal<Account[] | null | undefined>(undefined);
  account = signal<Account | null | undefined>(undefined);

  constructor(private accountService: AccountService,
    private operationService: OperationService,
    private router: Router) { }

  ngOnInit() {
  //  this.user = this.userService.getUser();
  console.log(this.user());
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
    console.log(this.user());
    this.accountService.getAccount(this.user()?.id!)
      .subscribe((response: ApiResponses<Account>) => {
        if(response.isSuccess){
          this.accounts.set(response.value);
          // console.log(this.accounts());
        }
      });
  }

  goToOperation(account: Account) {
    this.operationService.changeAccount(account);
    this.router.navigate(['/operation']);
  }

  onSelectAccount(account: Account) {
    this.accountService.setSelectedAccount(account);
    this.router.navigate(['/accounts', account.userId, 'operations']);
  }

}
