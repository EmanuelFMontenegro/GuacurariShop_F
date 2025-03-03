import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard.service'; 

export const routes: Routes = [
 
  {
    path: 'auth',
    children: [
      { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'registro', loadComponent: () => import('./features/auth/registro/registro.component').then(m => m.RegistroComponent) },
      { path: 'recuperarContraseña', loadComponent: () => import('./features/auth/recuperar-contrasena/recuperar-contrasena.component').then(m => m.RecuperarContrasenaComponent) },
    ]
  },
  
  
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [AuthGuard], 
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'ventas', loadComponent: () => import('./features/ventas/ventas.component').then(m => m.VentasComponent) },
      { path: 'productos', loadComponent: () => import('./features/productos/productos.component').then(m => m.ProductosComponent) },
      { path: 'cajas', loadComponent: () => import('./features/cajas/cajas.component').then(m => m.CajasComponent) },
      { path: 'lista-precios', loadComponent: () => import('./features/lista-precios/lista-precios.component').then(m => m.ListaPreciosComponent) },
      { path: 'gestion-productos', loadComponent: () => import('./features/gestion-productos/gestion-productos.component').then(m => m.GestionProductosComponent) },
      { path: 'clientes', loadComponent: () => import('./features/clientes/clientes.component').then(m => m.ClientesComponent) },
      { path: 'proveedores', loadComponent: () => import('./features/proveedores/proveedores.component').then(m => m.ProveedoresComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
