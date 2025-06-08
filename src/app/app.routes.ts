import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard.service';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component')
          .then(m => m.LoginComponent)
      },
      {
        path: 'registro',
        loadComponent: () => import('./features/auth/registro/registro.component')
          .then(m => m.RegistroComponent)
      },
      {
        path: 'recuperar-contrasena',
        loadComponent: () => import('./features/auth/recuperar-contrasena/recuperar-contrasena.component')
          .then(m => m.RecuperarContrasenaComponent)
      },
      {
        path: 'resetear-contrasena',
        loadComponent: () => import('./features/auth/resetear-contrasena/resetear-contrasena.component')
          .then(m => m.ResetearContrasenaComponent)
      }
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
    canMatch: [AuthGuard],  // Protege la carga del layout y subrutas
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component')
          .then(m => m.DashboardComponent),
      },
      {
        path: 'proveedores',
        loadComponent: () => import('./features/proveedores/proveedores.component')
          .then(m => m.ProveedoresComponent),
      },
      {
        path: 'clientes',
        loadComponent: () => import('./features/clientes/clientes.component')
          .then(m => m.ClientesComponent),
      },
      {
        path: 'productos',
        loadComponent: () => import('./features/productos/productos.component')             
        .then(m => m.ProductosComponent),
      },
      {
        path: 'lista-precios',
        loadComponent: () => import('./features/lista-precios/lista-precios.component')
          .then(m => m.ListaPreciosComponent),
      },
      {
        path: 'cajas',
        loadComponent: () => import('./features/cajas/cajas.component')
          .then(m => m.CajasComponent),
      },
      // Aquí agregamos la ruta de ventas
      // {
      //   path: 'ventas',
      //   loadComponent: () => import('./features/ventas/presentation/ventas.component')
      //     .then(m => m.VentasComponent),
      // },
    ]
  },

  // Ruta de redirección por defecto para rutas no encontradas
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
