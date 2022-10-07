import { Routes } from '@angular/router';

const Routing: Routes = [
    {
        path: '',
        redirectTo: 'dashboard'
    },
    {
        path: 'dashboard',
        pathMatch: 'full',
        loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    },
    {
        path: '**',
        redirectTo: 'error/404',
    },
];

export { Routing };