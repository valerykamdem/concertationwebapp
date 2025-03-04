import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccountService} from '../../../services/account.service';
import {UserService} from '../../../services/user.service';
import {Account} from '../../../models/account.model';
import {CardModule} from 'primeng/card';
import {ApiResponse} from '../../../interfaces/api-response';
import {User} from '../../../models/user.model';
import {ButtonModule} from 'primeng/button';
import {Select, SelectModule} from 'primeng/select';
import {FloatLabel} from 'primeng/floatlabel';
import {
  FormsModule, FormBuilder,
  ReactiveFormsModule, ValidatorFn,
  FormGroup, Validators,
  AbstractControl, ValidationErrors,
} from '@angular/forms';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {InputTextModule} from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';
import {FluidModule} from 'primeng/fluid';
import {TabsModule} from 'primeng/tabs';
import {SelectButton} from 'primeng/selectbutton';
import {MessageModule} from 'primeng/message';
import { InputOtp } from 'primeng/inputotp';

// @ts-ignore
@Component({
  imports: [
    ButtonModule,
    CardModule,
    FormsModule,
    CommonModule,
    FloatLabel,
    Select,
    ReactiveFormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    SelectModule,
    FluidModule,
    InputNumberModule,
    TabsModule,
    SelectButton,
    MessageModule,
    InputOtp
  ],
  selector: 'app-transfer',
  styleUrl: './transfer.component.css',
  templateUrl: './transfer.component.html',
})
export class TransferComponent implements OnInit {

  formBuilder = inject(FormBuilder);
  userService = inject(UserService);
  accountService = inject(AccountService);

  accounts = signal<Account[] | undefined>(undefined);
  pocketAccountNumber = signal<string | null>(null);
  savingAccountNumber = signal<string | null>(null);
  userToTransfer = signal<User | null | undefined>(undefined);
  errorAccountNbr = signal<string | null | undefined>(undefined);
  selectedAccount = signal<Account | null | undefined>(undefined);
  user = signal<User | null | undefined>(undefined);
  errorTransfer = signal<string | null | undefined>(undefined);

  balanceTotal: number = 0;
  checkAccNbr: boolean = false;
  isPinCheck: boolean = true;
  successTransfer: boolean = false;
  transferTitle: string = "Nouveau transfer"
  transferForm!: FormGroup;
  pinForm!: FormGroup;

  activeIndex: number = 0;

  stateOptions: any[] = [
    {label: 'Nouveau transfert', value: 'off', constant: false},
    {label: 'Entre mon compte', value: 'on'}
  ];

  ngOnInit(): void {
    this.getAccounts();
    this.getUser();

    // Formulaire de l'étape 1
    this.transferForm = this.formBuilder.group({
      selectedAcc: ['off'],
      toAccountNumber: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01), this.amountValidator(() => this.balance)]],
      purpose: ['', Validators.required],
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

  getAccounts(): void {
    this.accountService
      .getAccounts()
      .subscribe((response: ApiResponse<Account[] | null>) => {
        if (response.isSuccess) {
          // Vérifier si this.selectedAccount a déjà une valeur
          if (!this.selectedAccount()) {
            const pocketAccount = response.value!.find(a => a.accountType.toString() === '1');
            if (pocketAccount) {
              this.selectedAccount.set(pocketAccount);
            }
          }

          const savingAccount = response.value!.find(
            (a) => a.accountType.toString() === '2',);

          this.pocketAccountNumber.set(this.selectedAccount()?.accountNumber!);
          this.savingAccountNumber.set(savingAccount?.accountNumber!);
          this.accounts.set(response.value!);
          this.balanceTotal = response.value!.reduce(
            (accumulateur, account) => accumulateur + account.balance, 0,);
        }
      });
  }

  getAccountWithUserByAccountNbr(accountNbr: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.accountService.getByAccountNumber(accountNbr).subscribe({
        next: (response: ApiResponse<Account>) => {
          if (response.isSuccess) {
            this.userToTransfer.set(response.value?.user);
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

  amountValidator(getBalance: () => number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const amount = control.value;
      const balance = getBalance(); // Récupère dynamiquement le solde du compte sélectionné

      if (amount && balance !== null && amount > balance) {
        return { insufficientBalance: true }; // Retourne une erreur si le solde est insuffisant
      }

      return null; // Validation réussie
    };
  }

  get balance(): number {
    return this.selectedAccount() ? this.selectedAccount()!.balance : 0;
  }

  onChange(event: any): void {
    const toAccountControl = this.transferForm.get('toAccountNumber');
    const accountType = event.value.accountType;
    const isPocketAccount = accountType === 2;
    const isSavingWithActive = accountType === 1 && this.transferForm.get('selectedAcc')?.value === 'on';

    if (isPocketAccount) {
      this.transferForm.get('selectedAcc')?.setValue('on');
    }

    if (isPocketAccount || isSavingWithActive) {
      const targetValue = isPocketAccount ? this.pocketAccountNumber() : this.savingAccountNumber();
      toAccountControl?.disable();
      toAccountControl?.setValue(targetValue);
    } else {
      toAccountControl?.enable();
      toAccountControl?.reset();
    }

    // Revalider le champ "amount" après mise à jour du solde
    this.transferForm.get('amount')?.updateValueAndValidity();
  }

  onOptionClick(event: any): void {
    const toAccountControl = this.transferForm.get('toAccountNumber');
    this.transferTitle = event.option.label;
    if (event.index === 1) {
      // Gestion du transfer interne
      toAccountControl?.disable();
      const targetAccount = this.selectedAccount()?.accountNumber === this.pocketAccountNumber()
        ? this.savingAccountNumber()
        : this.pocketAccountNumber();
      toAccountControl?.setValue(targetAccount);
      this.isPinCheck = false;
    } else {
      // Réinitialisation
      const defaultAccount = this.accounts()?.find(a => a.accountType.toString() === '1');
      this.selectedAccount.set(defaultAccount);
      toAccountControl?.enable();
      toAccountControl?.reset();
      this.isPinCheck = true;
    }
  }

  onFocus(){
    this.errorTransfer.set(null);
  }

  async goToSummary(): Promise<void> {
    if (this.transferForm.valid) {

      const formValues = this.transferForm.getRawValue();
      this.isPinCheck = true;
      this.successTransfer = false;
      this.errorTransfer.set(null);

      try {
        this.checkAccNbr = true;
        // Attendez que getUser() se termine avant de continuer
        await this.getAccountWithUserByAccountNbr(formValues.toAccountNumber);

        if (this.errorAccountNbr() === null || this.errorAccountNbr() === undefined) {
          // console.log('Nicht-errorAccountNbr:', this.errorAccountNbr);
          this.activeIndex = 1;
        } else {
          // console.log('errorAccountNbrElse:', this.errorAccountNbr);
          this.activeIndex = 0;
        }
        this.checkAccNbr = false;

        if (formValues.selectedAcc === 'on') {
          this.isPinCheck = false;
        }

      } catch (error) {
        console.error("Erreur lors de la récupération de l`utilisateur:", error);
        // Gérez l'erreur comme approprié
        this.checkAccNbr = false;
      }
    } else {
      console.error('Formulaire invalide');
      this.transferForm.markAllAsTouched();
    }
  }

  // Méthode pour revenir à l'étape précédente
  previous() {
    if(this.successTransfer){
      this.transferForm.reset();
    }
    this.activeIndex = 0;
  }

  // Méthode pour valider le transfer
  confirm() {
    const formValues = this.transferForm.getRawValue();
    const pinFormValues = this.pinForm.getRawValue();
    const operation = {
      fromAccountNumber: this.selectedAccount()!.accountNumber,
      toAccountNumber: formValues.toAccountNumber,
      amount: formValues.amount,
      purpose: formValues.purpose,
      pinCode: pinFormValues.pinCode,
    };

    const pinCode = {
      userId: this.user()!.id,
      accountNumber: null,
      pinCode: pinFormValues.pinCode,
    };

    if (!this.isPinCheck) {
      this.transfer(operation);
    }

    if (this.pinForm.valid) {
      this.checkUserPin(pinCode, operation);
      this.pinForm.reset();
    } else {
      this.pinForm.markAllAsTouched();
    }
  }

  private transfer(operation: any): void {
    this.accountService
      .transfer(operation)
      .subscribe((response: ApiResponse<boolean | null>) => {
        if (response.isSuccess) {
          this.successTransfer = true;
          this.isPinCheck = true;
          this.getAccounts();
        } else {
          this.errorTransfer.set(response.error.description);
        }
      })
  }

  private checkUserPin(pinCode: any, operation: any): void {
    this.accountService
      .checkUserPin(pinCode)
      .subscribe((response: ApiResponse<boolean | null>) => {
        if (response.isSuccess) {
          // this.successTransfer = true;
          this.transfer(operation);
        } else {
          this.errorTransfer.set(response.error.description);
        }
      })
  }

}
