import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../../services/login.service';
import { HttpErrorResponse } from '@angular/common/http';
import { StorageService } from 'src/app/services';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;
  subs: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private AuthService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private loginService: LoginService,
  ) {
    this.isLoading$ = this.AuthService.isLoading$
    if (this.AuthService.currentUser$) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.AuthService.logout();
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required])],
    });
  }

  submit() {
    if (!this.loginForm.valid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      this.toastr.error('verifique la información ingresada para poder continuar', 'Error');
      return;
    }
    const email = this.loginForm.controls.email.value;
    const password = this.loginForm.controls.password.value;
    this.AuthService.isLoadingSubject.next(true);
    const loginSub = this.loginService.login(email, password).subscribe({
      next: async (result) => {
        this.AuthService.isLoadingSubject.next(false);
        await this.AuthService.saveUser(result);
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        this.AuthService.isLoadingSubject.next(false);
        this.toastr.error(err.message, "ERROR");
      }
    });
  }

  ngOnDestroy() {
    if (this.subs.length > 0)
      this.subs.forEach(x => x.unsubscribe());
  }
}
