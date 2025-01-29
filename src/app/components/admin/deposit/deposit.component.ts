import {Component, inject, OnInit, signal} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {FloatLabel} from "primeng/floatlabel";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputGroupModule} from "primeng/inputgroup";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {InputNumberModule} from "primeng/inputnumber";
import {InputOtp} from "primeng/inputotp";
import {InputTextModule} from "primeng/inputtext";
import {MessageModule} from "primeng/message";
import {CommonModule} from "@angular/common";
import {SelectModule} from "primeng/select";
import {CardModule} from "primeng/card";
import {FluidModule} from "primeng/fluid";
import {TabsModule} from "primeng/tabs";
import {UserService} from "../../../services/user.service";
import {AccountService} from "../../../services/account.service";
import {User} from "../../../models/user.model";
import {ApiResponse} from "../../../interfaces/api-response";
import {UserPinRequest} from "../../../interfaces/userPin-request";
import {OperationRequest} from "../../../interfaces/operation-request";
import {Account} from "../../../models/account.model";

@Component({
    selector: 'app-deposit',
  imports: [
    ButtonModule,
    CardModule,
    FormsModule,
    CommonModule,
    FloatLabel,
    ReactiveFormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    SelectModule,
    FluidModule,
    InputNumberModule,
    TabsModule,
    MessageModule,
    InputOtp
  ],
    templateUrl: './deposit.component.html',
    styleUrl: './deposit.component.css'
})
export class DepositComponent implements OnInit {

  formBuilder = inject(FormBuilder);
  userService = inject(UserService);
  accountService = inject(AccountService);

  user = signal<User | null | undefined>(undefined);
  userToDeposit = signal<User | null | undefined>(undefined);
  errorAccountNbr = signal<string | null | undefined>(undefined);
  errorDeposit = signal<string | null | undefined>(undefined);

  successDeposit: boolean = false;
  checkAccNbr: boolean = false;
  activeIndex: number = 0;
  depositTitle: string = "Nouveau dépôt"
  depositForm!: FormGroup;
  pinForm!: FormGroup;

  ngOnInit(): void {
    this.getUser();

    // Formulaire de l'étape 1
    this.depositForm = this.formBuilder.group({
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
            this.userToDeposit.set(response.value?.user);
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
    if (this.depositForm.valid) {

      const formValues = this.depositForm.getRawValue();
      // this.isPinCheck = true;
      this.successDeposit = false;
      this.errorDeposit.set(null);

      try {
        this.checkAccNbr = true;
        // Attendez que getUser() se termine avant de continuer
        await this.getAccountWithUserByAccountNbr(formValues.accountNumber);

        if (this.errorAccountNbr() === null || this.errorAccountNbr() === undefined) {
          // console.log('Nicht-errorAccountNbr:', this.errorAccountNbr);
          this.activeIndex = 1;
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
      this.depositForm.markAllAsTouched();
    }
  }

  onFocus(event: Event){
    this.errorDeposit.set(null);
  }

  previous() {
    if(this.successDeposit){
      this.depositForm.reset();
    }
    this.activeIndex = 0;
  }

  confirm() {
    const formValues = this.depositForm.getRawValue();
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

  private deposit(operation: OperationRequest): void {
    this.accountService
      .deposit(operation)
      .subscribe((response: any) => {
        if (response.isSuccess) {
          this.successDeposit = true;
        } else {
          this.errorDeposit.set(response.error.description);
        }
      })
  }

  private checkUserPin(uPinRequest: UserPinRequest, operation: any): void {
    this.accountService
      .checkUserPin(uPinRequest)
      .subscribe((response: any) => {
        if (response.isSuccess) {
          this.deposit(operation);
        } else {
          this.errorDeposit.set(response.error.description);
        }
      })
  }

}
