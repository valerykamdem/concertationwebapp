import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../services/account.service';
import { User } from '../../../models/user.model';
import { ApiResponse } from '../../../interfaces/api-response';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { NgFor } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule, 
    AvatarModule, 
    NgFor,
    StyleClassModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  user = signal<User | null | undefined>(undefined);

  constructor(private accountService: AccountService) { }

  ngOnInit() {
    // this.loadAccounts();
  }

  loadAccounts() {
     this.accountService.getAccounts().subscribe((response: any) => {
      if(response.isSuccess){
        //debugger
        this.user = response.value;
      }     
    }); 
    // this.accountService.getAccount(userId).subscribe(
    //   account => this.account = account,
    //   error => console.error('Erreur lors de la récupération du compte', error)
    // );
  }

}
