import { Component } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { User } from '../../../models/account.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  accounts: any[] = [];

  user: User | undefined;

  constructor(private accountService: AccountService) { }

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
     this.accountService.getAccounts().subscribe((user: any) => {
      debugger
      if(user.isSuccess){
        this.user = user.value;
      }     
    }); 
    // this.accountService.getAccount(userId).subscribe(
    //   account => this.account = account,
    //   error => console.error('Erreur lors de la récupération du compte', error)
    // );
  }

}
