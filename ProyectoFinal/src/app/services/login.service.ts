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
    private userService: UserService
  ) { }

  ngOnDestroy(): void {
    if (this.subs.length > 0)
      this.subs.forEach(x => x.unsubscribe());
  }


  login(email: string, password: string) {
    if (!email || !password) {
      throw new Error('El email y la contraseña son requeridos');
    }

    return this.userService.getAllUsers().pipe(
      map((result: IUser[]) => {
        if (result.length <= 0) {
          throw new Error('email o contraseña incorrectos');
        }
        const user = result.find((u) => {
          return (u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        });

        if (!user) {
          throw new Error('email o contraseña incorrectos');
        }
        user.token = "auth-token-" + Guid.create().toString();
        return user;
      })
    );
  }


}
