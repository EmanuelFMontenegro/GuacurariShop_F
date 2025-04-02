import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard.service';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'resetear-contrasena', loadComponent: () => import('./features/auth/resetear-contrasena/resetear-contrasena.component').then(m => m.ResetearContrasenaComponent) },
    ]
  },
  
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },

  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [AuthGuard], 
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) ,canActivate: [RoleGuard],data: { expectedRoles: ['ROLE_ADMIN']}},
      // { path: 'ventas', loadComponent: () => import('./features/ventas/ventas.component').then(m => m.VentasComponent), canActivate: [RoleGuard], data: { expectedRoles: ['ROLE_USER', 'ROLE_VENDEDOR'] } },
      // { path: 'gestion-productos', loadComponent: () => import('./features/gestion-productos/gestion-productos.component').then(m => m.GestionProductosComponent), canActivate: [RoleGuard], data: { expectedRoles: ['ROLE_USER'] } },
      // { path: 'lista-precios', loadComponent: () => import('./features/lista-precios/lista-precios.component').then(m => m.ListaPreciosComponent), canActivate: [RoleGuard], data: { expectedRoles: ['ROLE_USER', 'ROLE_VENDEDOR'] } },
    ]
  },

  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
