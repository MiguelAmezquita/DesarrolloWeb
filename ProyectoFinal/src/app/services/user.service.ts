import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../interfaces';
import { environment } from 'src/environments/environment';

const API_USERS_URL = `${environment.apiUrl}/users`;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private httpClient: HttpClient
  ) { }

  createUser(user: IUser): Observable<any> {
    user.token = 'auth-token-' + Math.random();
    return this.httpClient.post<IUser>(API_USERS_URL, user);
  }

  getAllUsers(): Observable<IUser[]> {
    return this.httpClient.get<IUser[]>(API_USERS_URL);
  }
}
