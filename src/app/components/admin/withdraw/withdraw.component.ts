import {Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserService} from "../../../services/user.service";
import {AccountService} from "../../../services/account.service";
import {User} from "../../../models/user.model";
import {ApiResponse} from "../../../interfaces/api-response";
import {UserPinRequest} from "../../../interfaces/userPin-request";
import {Button} from "primeng/button";
import {FloatLabel} from "primeng/floatlabel";
import {InputGroup} from "primeng/inputgroup";
import {InputGroupAddon} from "primeng/inputgroupaddon";
import {InputNumber} from "primeng/inputnumber";
import {InputOtp} from "primeng/inputotp";
import {InputText} from "primeng/inputtext";
import {Message} from "primeng/message";
import {CommonModule} from "@angular/common";
import {OperationRequest} from "../../../interfaces/operation-request";
import {Account} from "../../../models/account.model";

@Component({
    selector: 'app-withdraw',
  imports: [
    Button,
    FloatLabel,
    FormsModule,
    InputGroup,
    InputGroupAddon,
    InputNumber,
    InputOtp,
    InputText,
    Message,
    CommonModule,
    ReactiveFormsModule
  ],
    templateUrl: './withdraw.component.html',
    styleUrl: './withdraw.component.css'
})
export class withdrawComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  userService = inject(UserService);
  accountService = inject(AccountService);

  user = signal<User | null | undefined>(undefined);
  userToWithdraw = signal<User | null | undefined>(undefined);
  errorAccountNbr = signal<string | null | undefined>(undefined);
  errorWithdraw = signal<string | null | undefined>(undefined);

  successWithdraw: boolean = false;
  checkAccNbr: boolean = false;
  activeIndex: number = 0;
  withdrawTitle: string = "Nouveau retrait"
  withdrawForm!: FormGroup;
  pinForm!: FormGroup;

  ngOnInit(): void {
    this.getUser();

    // Formulaire de l'étape 1
    this.withdrawForm = this.formBuilder.group({
      accountNumber: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
    });

    // Formulaire de l'étape 2
    this.pinForm = this.formBuilder.group({
      pinCode: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
    });
  }

  getUser(): void {
    this.userService.getUser()
      .subscribe((response: ApiResponse<User | null | undefined>) => {
        if (response.isSuccess) {
          this.user.set(response.value);
        }
      });
  }

  getAccountWithUserByAccountNbr(accountNbr: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.accountService.getByAccountNumber(accountNbr).subscribe({
        next: (response: ApiResponse<Account>) => {
          if (response.isSuccess) {
            console.log("By Number", response);
            this.userToWithdraw.set(response.value?.user);
            this.errorAccountNbr.set(null); // Réinitialiser l'erreur en cas de succès
            resolve();
          } else {
            this.errorAccountNbr.set(response.error.description);
            resolve(); // On résout même en cas d'erreur pour permettre la gestion dans goToSummary
          }
        },
        error: (error) => {
          console.error('Erreur lors de la récupération de l\'utilisateur:', error);
          this.errorAccountNbr.set('Une erreur est survenue sur le numero de compte');
          reject(error);
        }
      });
    });
  }

  async goToSummary(): Promise<void> {
    if (this.withdrawForm.valid) {

      const formValues = this.withdrawForm.getRawValue();
      // this.isPinCheck = true;
      this.successWithdraw = false;
      this.errorWithdraw.set(null);

      try {
        this.checkAccNbr = true;
        // Attendez que getUser() se termine avant de continuer
        await this.getAccountWithUserByAccountNbr(formValues.accountNumber);

        if (this.errorAccountNbr() === null || this.errorAccountNbr() === undefined) {
          // console.log('Nicht-errorAccountNbr:', this.errorAccountNbr);
          this.activeIndex = 1;

          // Check bonité

        } else {
          // console.log('errorAccountNbrElse:', this.errorAccountNbr);
          this.activeIndex = 0;
        }
        this.checkAccNbr = false;

      } catch (error) {
        console.error("Erreur lors de la récupération de l`utilisateur:", error);
        // Gérez l'erreur comme approprié
        this.checkAccNbr = false;
      }
    } else {
      console.error('Formulaire invalide');
      this.withdrawForm.markAllAsTouched();
    }
  }

  onFocus(event: Event){
    this.errorWithdraw.set(null);
  }

  previous() {
    if(this.successWithdraw){
      this.withdrawForm.reset();
    }
    this.activeIndex = 0;
  }

  confirm() {
    const formValues = this.withdrawForm.getRawValue();
    const pinFormValues = this.pinForm.getRawValue();
    const operation = {
      accountNumber: formValues.accountNumber,
      amount: formValues.amount,
    };

    const userPinRequest = {
      userId: this.user()!.id,
      accountNumber: formValues.accountNumber,
      pinCode: pinFormValues.pinCode,
    };

    if (this.pinForm.valid) {
      this.checkUserPin(userPinRequest, operation);
      this.pinForm.reset();
    } else {
      this.pinForm.markAllAsTouched();
    }
  }

  private withdrawal(operation: OperationRequest): void {
    this.accountService
      .withdrawal(operation)
      .subscribe((response: any) => {
        if (response.isSuccess) {
          this.successWithdraw = true;
        } else {
          this.errorWithdraw.set(response.error.description);
        }
      })
  }

  private checkUserPin(uPinRequest: UserPinRequest, operation: any): void {
    this.accountService
      .checkUserPin(uPinRequest)
      .subscribe((response: any) => {
        if (response.isSuccess) {
          this.withdrawal(operation);
        } else {
          this.errorWithdraw.set(response.error.description);
        }
      })
  }
}
