import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LayoutComponent } from './components/shared/layout/layout.component';
import { AccountResolver } from './utils/account.resolver';


export const routes: Routes = [
    // {
    //     path: '',
    //     redirectTo:'login',
    //     pathMatch:'full'
    // },
    {
        path:'login',
        loadComponent: () => import('./components/shared/login/login.component')
        .then(module => module.LoginComponent)  
    },
    {
        path:'',  component: LayoutComponent,
        children:[
            {
                path:'',
                loadComponent: () => import('./components/shared/dashboard/dashboard.component')
                .then(module => module.DashboardComponent),
                canActivate:[AuthGuard]
            },
            {
                path:'retrait',
                loadComponent: () => import('./components/admin/retrait/retrait.component')
                .then(module => module.retraitComponent),
                canActivate:[AuthGuard]
            },
            {
                path:'depot',
                loadComponent: () => import('./components/admin/depot/depot.component')
                .then(module => module.DepotComponent),
                canActivate:[AuthGuard]
            },
            {
                path:'transfert',
                loadComponent: () => import('./components/member/transfert/transfert.component')
                .then(module => module.TransfertComponent),
                canActivate:[AuthGuard]
            },
            {
                path:'operation',
                loadComponent: () => import('./components/member/operation/operation.component')
                .then(module => module.OperationComponent),
                canActivate:[AuthGuard]
            },
            { 
                path: 'accounts/:userId/operations', 
                loadComponent: () => import('./components/member/operation/operation.component')
                .then(module => module.OperationComponent), 
                resolve: { account: AccountResolver },
                canActivate:[AuthGuard]
            }
        ]
    },
    {
        path:'**',
        loadComponent: () => import('./components/shared/notfound/notfound.component')
        .then(module => module.NotFoundComponent)
    }
];
