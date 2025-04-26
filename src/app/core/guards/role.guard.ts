import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { map} from 'rxjs/operators';


export const RoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles: string[] = route.data['expectedRoles'] || [];
  const roles$ = toObservable(authService.userRoles); 

  return roles$.pipe(
    map((roles: string[]) => {       
      const hasAccess = roles.some(role => expectedRoles.includes(role));
      if (!hasAccess) {
        router.navigate(['/unauthorized']);
      }
  
      return hasAccess;
    })
  );
  
};
