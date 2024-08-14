import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo:'login',
        pathMatch:'full'
    },
    {
        path:'login',
        loadComponent: () => import('./components/shared/login/login.component')
        .then(module => module.LoginComponent)
    },
    {
        path:'',
        loadComponent: () => import('./components/shared/layout/layout.component')
        .then(module => module.LayoutComponent),
        children:[
            {
                path:'dashboard',
                loadChildren: () => import('./components/shared/dashboard/dashboard.component')
                .then(module => module.DashboardComponent),
                canActivate:[AuthGuard]
            }
        ]
    },
    {
        path:'**',
        loadComponent: () => import('./components/shared/page-not-found/page-not-found.component')
        .then(module => module.PageNotFoundComponent)
    }
];
