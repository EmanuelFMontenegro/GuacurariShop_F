import { CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';  // Para notificaciones

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService); // Para mostrar notificaciones

  const isAuth$ = toObservable(authService.isAuthenticated);
  const expectedRoles = route.data?.['roles'] as string[] || [];

  return isAuth$.pipe(
    switchMap(isAuth => {
      if (!isAuth) {
        toastr.warning('No estás autenticado. Redirigiendo al login...', 'Autenticación requerida');
        router.navigate(['/auth/login']);
        return of(false);
      }

      const userRoles = authService.userRoles();
      const hasRole = expectedRoles.length === 0 || userRoles.some(role => expectedRoles.includes(role));

      if (!hasRole) {
        toastr.warning('No tienes permisos suficientes para acceder a esta página.', 'Acceso denegado');
        router.navigate(['/unauthorized']);
        return of(false);
      }

      return of(true);
    })
  );
};
