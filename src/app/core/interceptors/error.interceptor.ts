import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@core/services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
 

  constructor(
    private injector: Injector, 
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  private getAuthService(): AuthService {
    if (!this.authService) {
      this.authService = this.injector.get(AuthService);
    }
    return this.authService;
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((err: unknown) => {
        if (err instanceof HttpErrorResponse) {
          const error = err;

          if (error.status === 401) {
            this.getAuthService().logout();
            this.router.navigate(['/login']);
          }

          if (error.status === 403 && req.url.includes('/auth/login')) {
            this.toastr.error('El usuario no existe. Debes registrarte primero.', 'Error 403');
            this.router.navigate(['/register']);
          }

          if (error.status === 404 && req.url.includes('/auth/login')) {
            this.toastr.error('El usuario no existe. Debes registrarte primero.', 'Error 404');
            this.router.navigate(['/register']);
          }

          else if (error.status === 500) {
            this.toastr.error('Hubo un problema en el servidor. Intenta más tarde.', 'Error 500');
          }

          else {
            this.toastr.error('Algo salió mal, pero no te vamos a sacar de la app 😉');
          }
        }

        return throwError(() => err);
      })
    );
  }
}
