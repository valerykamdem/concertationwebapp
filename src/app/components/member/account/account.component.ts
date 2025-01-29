import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { Account } from '../../../models/account.model';
import { Operation } from '../../../models/operation.model';
import { AccountService } from '../../../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from '../../../interfaces/api-response';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import {FloatLabel} from "primeng/floatlabel";
import {InputGroup} from "primeng/inputgroup";
import {InputGroupAddon} from "primeng/inputgroupaddon";
import {Dialog} from "primeng/dialog";
import {OperationComponent} from "../operation/operation.component";

@Component({
  selector: 'app-account',
  imports: [
    CommonModule,
    CardModule,
    PaginatorModule,
    ButtonModule,
    TableModule,
    FormsModule,
    Select,
    FloatLabel,
    InputGroup,
    InputGroupAddon,
    OperationComponent
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit {

  accountService = inject(AccountService);
  router = inject(Router);
  accounts = signal<Account[] | undefined>(undefined);
  selectedAccount = signal<Account | null | undefined>(undefined);
  operations: Operation[] = [];

  async ngOnInit() {
    this.getAccounts();
  }

  getAccounts(): void {
    // const accountType = this.route.snapshot.paramMap.get('accountType')!;

    this.accountService.getUserAccountWithOperations()
      .subscribe((response: ApiResponse<Account[] | null>) => {
        if(response.isSuccess){
          this.selectedAccount.set(response.value!.find(a => a.accountType.toString() === '1'));
          this.accounts.set(response.value!);
        }
      });
  }

  get balance(): number {
    return this.selectedAccount() ? this.selectedAccount()!.balance : 0;
  }

  onChange(event: any): void {
    const accountType = event.value.accountType;
    this.selectedAccount.set(this.accounts()!
      .find(a => a.accountType.toString() === accountType.toString()));
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
