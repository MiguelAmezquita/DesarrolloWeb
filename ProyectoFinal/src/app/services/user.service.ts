import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../interfaces';
import { environment } from 'src/environments/environment';
import { Guid } from 'guid-typescript';

const API_USERS_URL = `${environment.apiUrl}/usuarios`;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private httpClient: HttpClient
  ) { }

  createUser(user: IUser): Observable<any> {
    user.id = Guid.create().toString();
    user.token = 'auth-token-' + Guid.create().toString();
    return this.httpClient.post<IUser>(API_USERS_URL, user);
  }

  deleteUser(id: string) {
    return this.httpClient.delete<IUser>(`${API_USERS_URL}/${id}`);
  }

  updateUser(user: IUser) {
    return this.httpClient.put<IUser>(`${API_USERS_URL}/${user.id}`, user);
  }

  getAllUsers(): Observable<IUser[]> {
    return this.httpClient.get<IUser[]>(API_USERS_URL);
  }
}
