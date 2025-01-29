import {Component, inject, input, Input, InputSignal, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Operation } from '../../../models/operation.model';
import { TableModule } from 'primeng/table';
import {Dialog} from "primeng/dialog";
import {Account} from "../../../models/account.model";
import {TagModule} from "primeng/tag";

@Component({
    selector: 'app-operation',
  imports: [
    CommonModule,
    TagModule,
    ButtonModule,
    TableModule,
    Dialog
  ],
    templateUrl: './operation.component.html',
    styleUrl: './operation.component.css'
})
export class OperationComponent {

  operation = signal<Operation | null>(null);
  selectedOperation!: Operation;
  visible: boolean = false;

  account: InputSignal<Account> = input(new Account());

  onRowSelect(event: any) {
    // console.log(event.data);
    this.visible = true;
    this.operation.set(event.data);
  }

  getAmountWithSign(operation: Operation): string {
    const amount = operation.amount.toFixed(2); // Formatage à 2 décimales
    // const type = operation.operationType;

    switch (operation.operationType) {
      case 1:
        return `+ ${amount}`;
      case 2:
        return `- ${amount}`;
      case 3:
        return `+ ${amount}`;
      case 4:
        return `- ${amount}`;
      case 5:
        return `- ${amount}`;
      case 6:
        return `+ ${amount}`;
      default:
        console.log('Unknown status.');
        return amount.toString();
    }
  }

  getSeverity(opType: number) {
    switch (opType) {
      case 1:
        return 'success';
      case 2:
        return 'danger';
      case 3:
        return 'success';
      case 4:
        return 'danger';
      case 5:
        return 'danger';
      case 6:
        return 'info';
      default:
        console.log('Unknown status.');
        return 'contrast';
    }
  }

}
