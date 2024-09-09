import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperationService } from '../../../services/operation.service';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/account.model';
import { Location } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { Operation } from '../../../models/operation.model';
import { ApiResponse, ApiResponses } from '../../../interfaces/api-response';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-operation',
  standalone: true,
  imports: [
    CommonModule, 
    ButtonModule,
    TableModule],
  templateUrl: './operation.component.html',
  styleUrl: './operation.component.css'
})
export class OperationComponent implements OnInit {

  operations1 = signal<Operation[] | null | undefined>(undefined);
  operations!: Operation[];
  balanceTotal = 0;
  lastOperation = signal<Operation | null | undefined>(undefined);

  constructor(
    private accountService: AccountService,
    private operationService: OperationService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit() {
    this.getOperationsByAccount();
  }

  getOperationsByAccount(): void {
    const accountId = this.route.snapshot.paramMap.get('accountId')!;
    this.operationService.getOperationByAccountId(accountId)
      .subscribe((response: ApiResponses<Operation>) => {
        if(response.isSuccess){
          this.operations = response.value;
          this.lastOperation.set(this.operations[0]);
          console.log("last element", this.lastOperation())
        }
      });
  }

  goBack(): void {
    this.location.back();
  }

  goToTransfert(): void {
    this.router.navigate(['/transfert']);
  }

}
