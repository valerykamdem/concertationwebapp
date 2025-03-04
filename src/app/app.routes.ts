import {Routes} from '@angular/router';
import {AuthGuard} from './guards/auth.guard';

export const routes: Routes = [
  // {
  //   path: '',
  //   // redirectTo: '/',
  //   pathMatch: 'full',
  //   component: LayoutComponent
  // },
  // {
  //   path: 'loading',
  //   loadComponent: () => import('./components/shared/loading/loading.component')
  //     .then(c => c.LoadingComponent)
  // },
  {
    path: 'login',
    // component : LoginComponent
    loadComponent: () => import('./components/shared/login/login.component')
      .then(c => c.LoginComponent)
  },
  {
    path: '', loadComponent: () => import('./components/shared/layout/layout.component')
      .then(c => c.LayoutComponent),
    canActivate: [AuthGuard],
    children: [
      // {
      //   path: '',
      //   redirectTo: '/dashboard',
      //   pathMatch: 'full'
      // },
      {
        path: '',
        loadComponent: () => import('./components/shared/dashboard/dashboard.component')
          .then(c => c.DashboardComponent),
      },
      {
        path: 'withdraw',
        loadComponent: () => import('./components/admin/withdraw/withdraw.component')
          .then(c => c.withdrawComponent),
      },
      {
        path: 'deposit',
        loadComponent: () => import('./components/admin/deposit/deposit.component')
          .then(c => c.DepositComponent),
      },
      {
        path: 'transfer',
        loadComponent: () => import('./components/member/transfer/transfer.component')
          .then(c => c.TransferComponent),
      },
      {
        path: 'accounts',
        loadComponent: () => import('./components/member/account/account.component')
          .then(c => c.AccountComponent),
      },
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./components/shared/notfound/notfound.component')
      .then(c => c.NotFoundComponent)
  }
];
