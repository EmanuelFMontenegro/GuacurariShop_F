
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { RecuperarContrasenaComponent } from './recuperar-contrasena/recuperar-contrasena.component';

export const authRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'recuperar-contrasena', component: RecuperarContrasenaComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }, 
];
