import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { IUser } from '../interfaces';
import { StorageService } from './storage.service';

export type UserType = IUser | undefined;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  Token: string | undefined;
  isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserSubject: BehaviorSubject<UserType> = new BehaviorSubject<UserType>(undefined);
  isLoading$: Observable<boolean>;
  currentUser$: Observable<UserType>;

  constructor(
    private router: Router,
    private storage: StorageService,
  ) {
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  logout() {
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
    this.storage.clearAll();
  }

  async getActiveUser(): Promise<IUser | undefined> {
    const user = await this.storage.get('Usuario');
    if (user) {
      const tempUser = JSON.parse(user)
      this.currentUserSubject.next(tempUser)
      return tempUser;
    }
    else
      return undefined;
  }

  async getActiVeTokens() {
    const token = await this.storage.get('Token');
    await this.getActiveUser();
    if (token != null) {
      this.Token = JSON.parse(token);
    }
  }

  async saveUser(user: IUser) {
    this.currentUserSubject.next(user);
    this.storage.save('Usuario', user);
    this.storage.save('Token', user.token);
  }

  async validaToken(): Promise<boolean> {
    await this.getActiVeTokens();
    console.log(this.Token);

    if (!this.Token) {
      this.logout();
      return Promise.resolve(false);
    } else {
      return Promise.resolve(true);
    }
  }
}
