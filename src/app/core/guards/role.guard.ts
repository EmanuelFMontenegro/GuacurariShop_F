import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.getRole().pipe(
      map(role => {
        // Si el rol es "admin", se permite el acceso
        if (role === 'admin') {
          return true;
        }

        // Si el rol es distinto de "admin", redirige al dashboard o una página de error
        this.router.navigate(['/']);
        return false;
      })
    );
  }
}
