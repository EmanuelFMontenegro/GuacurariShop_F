import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, combineLatest, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): Observable<boolean> {
    return combineLatest([
      this.authService.isAuthenticated(),
      this.authService.userRoles$
    ]).pipe(
      map(([isAuthenticated, roles]) => {
       
        if (!isAuthenticated) {
          console.warn('Usuario no autenticado, redirigiendo a login');
          this.router.navigate(['/auth/login']);
          return false;
        }

       
        if (roles.includes('ROLE_USER') || roles.includes('ROLE_ADMIN') || roles.includes('SUPER-ADMIN')) {
          return true;
        }

        console.warn('Acceso denegado, redirigiendo a /unauthorized');
        this.router.navigate(['/unauthorized']);
        return false;
      })
    );
  }
}
