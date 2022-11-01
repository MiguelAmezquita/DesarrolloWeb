import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class LoginService implements OnDestroy {

  subs: Subscription[] = [];

  constructor(
    private httpClient: HttpClient,
    private toastr: ToastrService
  ) { }

  ngOnDestroy(): void {
    if (this.subs.length > 0)
      this.subs.forEach(x => x.unsubscribe());
  }


  login(user: string, password: string) {
    return this.httpClient.post("", { user, password });
  }
}
