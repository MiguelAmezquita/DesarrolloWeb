import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AgregarComponent, BuscarComponent, HeroeComponent, ListadoComponent } from './pages';

const rutas: Routes = [
  {
    path: '',
    children: [
      {
        path: 'listado',
        component: ListadoComponent,
      },
      {
        path: 'agregar',
        component: AgregarComponent,
      },
      {
        path: 'editar/:id',
        component: AgregarComponent,
      },
      {
        path: 'buscar',
        component: BuscarComponent,
      },
      {
        path: ':id',
        component: HeroeComponent,
      },
      { path: '**', redirectTo: 'listado' },
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(rutas)
  ],
  exports: [
    RouterModule
  ]
})
export class HeroesRoutingModule { }
