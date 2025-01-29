import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LayoutComponent } from './components/shared/layout/layout.component';
import { AccountResolver } from './utils/account.resolver';
import { UserResolver } from './utils/user.resolver';
import { DashboardComponent } from './components/shared/dashboard/dashboard.component';
// app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';


export const routes: Routes = [
    {
        path:'login',
        loadComponent: () => import('./components/shared/login/login.component')
        .then(module => module.LoginComponent)  
    },
    {
        path:'',  component: LayoutComponent,
        canActivate:[AuthGuard],
        children:[
            // {
            //     path: '',
            //     redirectTo:'/dashboard',
            //     pathMatch:'full'
            // },
            {
                path: '',
                loadComponent: () => import('./components/shared/dashboard/dashboard.component')
                .then(c => c.DashboardComponent),
            },
            {
                path:'retrait',
                loadComponent: () => import('./components/admin/retrait/retrait.component')
                .then(c => c.retraitComponent),
            },
            {
                path:'depot',
                loadComponent: () => import('./components/admin/depot/depot.component')
                .then(c => c.DepotComponent),
            },
            {
                path:'transfert',
                loadComponent: () => import('./components/member/transfert/transfert.component')
                .then(c => c.TransfertComponent),
            },
            {
                path:'accounts',
                loadComponent: () => import('./components/member/account/account.component')
                .then(c => c.AccountComponent),
            },
            {
                path:'accounts/:accountType',
                loadComponent: () => import('./components/member/account/account.component')
                .then(c => c.AccountComponent),
            },
            {
                path:'operations',
                loadComponent: () => import('./components/member/operation/operation.component')
                .then(c => c.OperationComponent),
            },
            { 
                path: 'operations/:accountId', 
                loadComponent: () => import('./components/member/operation/operation.component')
                .then(c => c.OperationComponent), 
            }
        ]
    },
    {
        path:'**',
        loadComponent: () => import('./components/shared/notfound/notfound.component')
        .then(c => c.NotFoundComponent)
    }
];
