import { Injectable, OnDestroy } from '@angular/core';
import { map, Observable, of, Subscription } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { IUser } from '../interfaces';
import { UserService } from './user.service';
import { Guid } from 'guid-typescript';


const API_USERS_URL = `${environment.apiUrl}/auth`;

@Injectable({
  providedIn: 'root'
})

export class LoginService implements OnDestroy {

  subs: Subscription[] = [];

  constructor(
    private httpClient: HttpClient,
    private toastr: ToastrService,
    private userService: UserService
  ) { }

  ngOnDestroy(): void {
    if (this.subs.length > 0)
      this.subs.forEach(x => x.unsubscribe());
  }


  login(email: string, password: string) {
    const notFoundError = new Error('Not Found');
    if (!email || !password) {
      return of(notFoundError);
    }

    return this.userService.getAllUsers().pipe(
      map((result: IUser[]) => {
        console.log(result);
        if (result.length <= 0) {
          return notFoundError;
        }
        const user = result.find((u) => {
          return (u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        });

        if (!user) {
          return notFoundError;
        }
        user.token = "auth-token-" + Guid.create().toString();
        return user;
      })
    );
  }


}
