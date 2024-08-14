import { Component } from '@angular/core';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  accounts: any[] = [];

  constructor(private accountService: AccountService) { }

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    /* this.accountService.getAccounts().subscribe((accounts: any[]) => {
      this.accounts = accounts;
    }); */
    // this.accountService.getAccount(userId).subscribe(
    //   account => this.account = account,
    //   error => console.error('Erreur lors de la récupération du compte', error)
    // );
  }

}
