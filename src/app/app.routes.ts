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
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component')
          .then(m => m.DashboardComponent),
        canActivate: [AuthGuard]
      },
      // {
      //   path: 'ventas',
      //   loadComponent: () => import('./features/ventas/presentation/ventas.component')
      //     .then(m => m.VentasComponent),
      //   canActivate: [AuthGuard]
      // },
      // {
      //   path: 'productos',
      //   loadComponent: () => import('./features/productos/productos.component')
      //     .then(m => m.ProductosComponent),
      //   canActivate: [AuthGuard]
      // },
      // {
      //   path: 'compras',
      //   loadComponent: () => import('./features/compras/compras.component')
      //     .then(m => m.ComprasComponent),
      //   canActivate: [AuthGuard]
      // },
      {
        path: 'proveedores',
        loadComponent: () => import('./features/proveedores/proveedores.component')
          .then(m => m.ProveedoresComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'clientes',
        loadComponent: () => import('./features/clientes/clientes.component')
          .then(m => m.ClientesComponent),
        canActivate: [AuthGuard]
      },
      // {
      //   path: 'reportes',
      //   loadComponent: () => import('./features/reportes/reportes.component')
      //     .then(m => m.ReportesComponent),
      //   canActivate: [AuthGuard]
      // },
      {
        path: 'lista-precios',
        loadComponent: () => import('./features/lista-precios/lista-precios.component')
          .then(m => m.ListaPreciosComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'cajas',
        loadComponent: () => import('./features/cajas/cajas.component')
          .then(m => m.CajasComponent),
        canActivate: [AuthGuard]
      },     
    ]
  },

  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
