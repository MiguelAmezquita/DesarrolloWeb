import { Routes } from '@angular/router';

const Routing: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
    },
    {
        path: '',
        loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    },
    {
        path: '**',
        redirectTo: 'error/404',
    },
];

export { Routing };