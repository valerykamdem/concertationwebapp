import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LayoutComponent } from './components/shared/layout/layout.component';

export const routes: Routes = [
  {
    path: '', component : LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // {
      //   path: '',
      //   redirectTo: 'dashboard',
      //   pathMatch: 'full'
      // },
      {
        path: '',
        // component : DashboardComponent,
        loadComponent: () => import('./components/member/dashboard/dashboard.component')
          .then(c => c.DashboardComponent),
      },
      {
        path: 'withdraw',
        // component : withdrawComponent,
        loadComponent: () => import('./components/admin/withdraw/withdraw.component')
          .then(c => c.withdrawComponent),
      },
      {
        path: 'deposit',
        // component : DepositComponent,
        loadComponent: () => import('./components/admin/deposit/deposit.component')
          .then(c => c.DepositComponent),
      },
      {
        path: 'transfer',
        // component : TransferComponent,
        loadComponent: () => import('./components/member/transfer/transfer.component')
          .then(c => c.TransferComponent),
      },
      {
        path: 'account',
        // component : AccountComponent,
        loadComponent: () => import('./components/member/account/account.component')
          .then(c => c.AccountComponent),
      },
      {
        path: 'profile',
        // component : AccountComponent,
        loadComponent: () => import('./components/member/profile/profile.component')
          .then(c => c.ProfileComponent),
      },
    ]
  },
  { path: 'auth', loadChildren: () => import('./components/shared/auth/auth.routes') },
  {
    path: '**',
    loadComponent: () => import('./components/shared/notfound/notfound.component')
      .then(c => c.NotFoundComponent)
  }
];
