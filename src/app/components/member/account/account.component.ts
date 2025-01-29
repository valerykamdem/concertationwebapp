import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { Account } from '../../../models/account.model';
import { Operation } from '../../../models/operation.model';
import { AccountService } from '../../../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse, ApiResponses } from '../../../interfaces/api-response';
import { FormGroup, FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-account',
  imports: [
    CommonModule,
    CardModule,
    PaginatorModule,
    ButtonModule,
    TableModule,
    FormsModule, 
    Select],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit {

  accountService = inject(AccountService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  accounts = signal<Account[] | undefined>(undefined);
  operations1 = signal<Operation[] | undefined>(undefined);
  operations: Operation[] = [];
  formGroup: FormGroup | undefined;
  selectedAccount?: Account;// | undefined;

  // constructor (private route: Router){}

  async ngOnInit() {
    this.getAccounts(); 
    // console.log("selectedAccount", this.selectedAccount);
  }

  getAccounts(): void {
    const accountType = this.route.snapshot.paramMap.get('accountType')!;
    console.log(accountType);
    this.accountService.getUserAccountWithOperations()
      .subscribe((response: ApiResponses<Account>) => {
        if(response.isSuccess){ 
          this.selectedAccount = response.value.find(a => a.accountType.toString() === accountType);
          this.accounts.set(response.value);
          this.operations = this.selectedAccount?.operations ?? [];
          // this.operations1.set(this.selectedAccount?.operations ?? []);
          console.log("dans le get", this.accounts());
        }
      });
  }

  onChange(event: any): void {
    // console.log("onChange", event.value);
      this.operations = event.value.operations;
  }

  goToTransfert(): void {
    this.router.navigate(['/transfert']);
  }

}
