import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { RouterModule, Routes } from '@angular/router';
import { Routing } from 'src/app/pages/routing';
import { FooterComponent } from './components/footer/footer.component';
import { AsideComponent } from './components/aside/aside.component';
import { HeaderComponent } from './components/header/header.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: Routing,
  },
];

@NgModule({
  declarations: [
    LayoutComponent,
    FooterComponent,
    AsideComponent,
    HeaderComponent,
    BreadcrumbsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class LayoutModule { }
