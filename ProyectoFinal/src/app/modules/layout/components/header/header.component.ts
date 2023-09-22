import { DOCUMENT } from '@angular/common'
import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserType } from 'src/app/services';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  usuario$: Observable<UserType>;
  constructor(@Inject(DOCUMENT) private document: Document, private AuthService: AuthService) { }

  ngOnInit(): void {
    this.usuario$ = this.AuthService.currentUserSubject.asObservable();
  }

  toggleSidebar() {
    //toggle sidebar function
    this.document.body.classList.toggle('toggle-sidebar');
  }

  logout() {
    this.AuthService.logout();
    document.location.reload();
  }

}
