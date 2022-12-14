import { DOCUMENT } from '@angular/common'
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
  }

  toggleSidebar() {
    //toggle sidebar function
    this.document.body.classList.toggle('toggle-sidebar');
  }
}
