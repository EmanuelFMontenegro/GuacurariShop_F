import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; 

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isPublicRoute = this.isPublicRequest(req.url);
    const token = this.getTokenFromCookies();

    const clonedRequest = req.clone({
      withCredentials: true,
      ...(token && !isPublicRoute
        ? { headers: req.headers.set('Authorization', `Bearer ${token}`) }
        : {})
    });

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse): Observable<HttpEvent<any>> => {
        let errorMessage = 'Ups, algo salió mal.';

        if (error.status === 401 && !isPublicRoute) {
          this.router.navigate(['/auth/login']);
          errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
        }

        if (error.status === 403 && this.router.url !== '/auth/login') {
          this.router.navigate(['/auth/login']);
          errorMessage = 'No tienes permisos suficientes para acceder a esta página.';
        }

        if (error.status >= 500) {
          errorMessage = 'Error en el servidor. Inténtalo nuevamente más tarde.';
        }
       
        this.toastr.error(errorMessage, 'Error', { timeOut: 3000 });

        return throwError(() => error); 
      })
    );
  }

  private getTokenFromCookies(): string | null {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='))?.split('=')[1] ?? null;
  }

  private isPublicRequest(url: string): boolean {
    return ['/auth/login', '/auth/register', '/auth/logout'].some(route =>
      url.includes(route)
    );
  }
}
