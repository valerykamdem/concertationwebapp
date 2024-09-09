import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<User | null> {

    private apiUrl : string =  environment.apiUrl;

  constructor(private http: HttpClient, private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User | null> {

    const url = `${this.apiUrl}/users/me`;

    // Si l'account est déjà présent dans le service, le renvoyer directement
    const cachedUser = this.userService.getUser()();
    if (cachedUser) {
      return of(cachedUser); // Observable de l'account en cache
    }

    // Sinon, faire un appel API pour récupérer le compte et ses opérations
    return this.http.get<User>(url);
  }
}
