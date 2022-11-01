import { Routes } from '@angular/router';

const Routing: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    },
    {
        path: 'usuarios',
        loadChildren: () => import('./usuarios/usuarios.module').then((m) => m.UsuariosModule),
    },
    {
        path: 'cursos',
        loadChildren: () => import('./cursos/cursos.module').then((m) => m.CursosModule),
    },
    {
        path: '**',
        redirectTo: 'error/404',
    },
];

export { Routing };