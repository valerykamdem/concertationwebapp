import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { Cacheable } from 'ts-cacheable'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  user = signal<User | null | undefined>(undefined);
  private http = inject(HttpClient);

  @Cacheable()
  getUser(): Observable<ApiResponse<User>> {
    // @ts-ignore
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/users/me`)
    .pipe(tap((result: any) => {
      if(result.isSuccess){
        this.user.set(result.value);
      }
    }));//, map((result: ApiResponse<| null | undefined>) => { return this.user(); }));
  }

  @Cacheable()
  getUserByAccountnumber(accountNbr: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/users/GetByAccountNumber/${accountNbr}`);
  }

}
