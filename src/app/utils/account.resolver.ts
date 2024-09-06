import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AccountService } from '../services/account.service';
import { Account } from '../models/account.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountResolver implements Resolve<Account | null> {

    private apiUrl : string =  environment.apiUrl;

  constructor(private http: HttpClient, private accountService: AccountService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Account | null> {
    const userId = route.paramMap.get('userId');
    // console.log(userId);
    const url = `${this.apiUrl}/accounts/GetByUserId/${userId}`;

    // Si l'account est déjà présent dans le service, le renvoyer directement
    const cachedAccount = this.accountService.getSelectedAccount();
    console.log("cachedAccount");
    console.log(cachedAccount);
    if (cachedAccount && cachedAccount.userId === userId) {
      return of(cachedAccount); // Observable de l'account en cache
    }

    // Sinon, faire un appel API pour récupérer le compte et ses opérations
    return this.http.get<Account>(url);
  }
}
