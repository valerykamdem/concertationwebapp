import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperationService } from '../../../services/operation.service';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/account.model';
import { Location } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-operation',
  standalone: true,
  imports: [
    CommonModule, 
    ButtonModule
  ],
  templateUrl: './operation.component.html',
  styleUrl: './operation.component.css'
})
export class OperationComponent implements OnInit {
  account = signal<Account | null | undefined>(undefined);
  account1: Account | null = null;

  constructor(
    private accountService: AccountService,
    private operationService: OperationService,
    private location: Location,
    private route: ActivatedRoute) {}

  ngOnInit() {
    // this.operationService.currentAccount.subscribe(account => this.account.set(account));

    // this.account1 = this.accountService.getSelectedAccount();

    // if (!this.account1) {
    //   // Si l'utilisateur a rafraîchi la page et que les données sont perdues,
    //   // redirigez-le ou gérez la situation comme vous le souhaitez
    //   console.error("Aucun compte sélectionné.");
    // }

    this.route.data.subscribe(data => {
      console.log(data['account']);
      this.account1 = data['account'];
    });

    console.log(this.operationService.currentAccountValue()());
    this.account = this.operationService.currentAccountValue();//.subscribe(account => this.account.set(account));

  }

  goBack(): void {
    this.location.back();
  }

}
