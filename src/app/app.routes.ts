import { Routes } from '@angular/router';
import { authGuard } from '@auth/guards/auth.guard';
import { HomeComponent } from '@home/home.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('@auth/pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: HomeComponent,
    canMatch: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
      },
      {
        path: 'products',
        loadComponent: () => import('@features/products/list/products-list.component').then(m => m.ProductsListComponent),
      },
      {
        path: 'cart',
        loadComponent: () => import('@features/cart').then(m => m.CartComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: ''
  }
];
