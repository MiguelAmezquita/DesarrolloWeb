import { Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

const Routing: Routes = [
    {
        path: 'dashboard',
        pathMatch: 'full',
        canActivate: [AuthGuard],
        loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    },
    {
        path: 'usuarios',
        pathMatch: 'full',
        canActivate: [AuthGuard],
        loadChildren: () => import('./usuarios/usuarios.module').then((m) => m.UsuariosModule),
    },
    {
        path: 'cursos',
        pathMatch: 'full',
        canActivate: [AuthGuard],
        loadChildren: () => import('./cursos/cursos.module').then((m) => m.CursosModule),
    },
    {
        path: '**',
        redirectTo: 'error/404',
    },
];

export { Routing };