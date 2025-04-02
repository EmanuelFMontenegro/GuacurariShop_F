import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Observable, of } from 'rxjs';
import { map, take, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const expectedRoles: string[] = route.data['expectedRoles'] || [];

    return this.authService.userRoles$.pipe(
      take(1),
      map((userRoles: string[]) => {
        if (!userRoles || userRoles.length === 0) {
          this.router.navigate(['/auth/login']);
          return false;
        }

        
        if (userRoles.includes('ROLE_ADMIN') || userRoles.includes('SUPER-ADMIN')) {
          return true;
        }

        if (expectedRoles.some(role => userRoles.includes(role))) {
          return true;
        }

        
        this.router.navigate(['/unauthorized']);
        return false;
      }),
      catchError(() => {
        this.router.navigate(['/auth/login']);
        return of(false);
      })
    );
  }
}
