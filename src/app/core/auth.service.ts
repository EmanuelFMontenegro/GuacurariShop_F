import { Injectable } from '@angular/core'; 
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ConfigService } from '../../services/ConfigService';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<string | null>(null);
  private userRolesSubject = new BehaviorSubject<string[]>([]);

  constructor(
    private router: Router,
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  get currentUser$(): Observable<string | null> {
    return this.currentUserSubject.asObservable();
  }

  get userRoles$(): Observable<string[]> {
    return this.userRolesSubject.asObservable();
  }

  getRole(): Observable<string | null> {
    return this.http.get<{ roles: string[] }>(`${this.configService.getApiUrl()}/auth/validate-token`, { withCredentials: true }).pipe(
      map(response => response.roles?.[0] || null), 
      catchError(() => of(null)) 
    );
  }

  login(email: string, password: string): Observable<HttpResponse<any>> {
    const loginUrl = `${this.configService.getApiUrl()}/auth/login`;

    return this.http.post<any>(loginUrl, { email, password }, { 
      withCredentials: true, observe: 'response' 
    }).pipe(
      tap(response => {
        if (response.status === 200) {
          this.currentUserSubject.next(email);

          // Solo cargar roles si no han sido cargados antes
          if (this.userRolesSubject.getValue().length === 0) {
            this.loadUserRoles();
          }
        }
      }),
      catchError(error => {
        console.error('Error en login:', error);
        return throwError(() => new Error(this.extractErrorMessage(error)));
      })
    );
  }

  loadUserRoles(): void {
    const validateTokenUrl = `${this.configService.getApiUrl()}/auth/validate-token`;

    this.http.get<{ roles: string[] }>(validateTokenUrl, { withCredentials: true })
      .subscribe({
        next: (response) => {
          this.userRolesSubject.next(response.roles || []);
        },
        error: (error) => {
          console.error('Error obteniendo roles:', error);
          this.userRolesSubject.next([]);
        }
      });
  }
        
  isAuthenticated(): Observable<boolean> {
    return this.http.get<boolean>(`${this.configService.getApiUrl()}/auth/validate-token`, { withCredentials: true }).pipe(
      catchError(() => of(false))
    );
  }
  
  resetPassword(token: string, password: string): Observable<any> {
    const resetPasswordUrl = `${this.configService.getApiUrl()}/auth/reset-password`;
    return this.http.post<any>(resetPasswordUrl, { token, password }, { withCredentials: true })
      .pipe(
        catchError((error) => {
          console.error('Error al restablecer la contraseña:', error);
          return throwError(() => new Error('No se pudo restablecer la contraseña'));
        })
      );
  }

  logout(): Observable<void> {
    return this.http.post<void>(
      `${this.configService.getApiUrl()}/auth/logout`, 
      {}, 
      { withCredentials: true }
    ).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
        this.userRolesSubject.next([]);
        this.router.navigateByUrl('/auth/login');
      }),
      catchError(error => {
        console.error('Error en logout:', error);
        return throwError(() => error);
      })
    );
  }

  public extractErrorMessage(error: any): string {
    return error.error?.message || error.message || 'Error de conexión';
  }
}