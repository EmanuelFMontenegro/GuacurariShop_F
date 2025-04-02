import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;

   
    if (!req.url.includes('/auth/login') && !req.url.includes('/auth/logout')) {
      const token = this.getTokenFromCookies();

      if (token) {
        authReq = req.clone({
          withCredentials: true
        });
        
      }
    }

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (error.status === 401 || error.status === 403) {
          if (!req.url.includes('/auth/logout')) {
            this.authService.logout().subscribe(() => {
              this.router.navigate(['/auth/login']);
            });
          }
        }
        return throwError(() => error);
      })
    );
  }

  private getTokenFromCookies(): string | null {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(row => row.startsWith('auth_token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  }
}
