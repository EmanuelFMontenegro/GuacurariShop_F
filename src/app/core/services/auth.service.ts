import { Injectable, Injector, computed, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs';
import { Observable, of, throwError } from 'rxjs';
import { ConfigService } from './ConfigService';
import { toObservable } from '@angular/core/rxjs-interop';

export interface LoginResponse {
  role: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // === SIGNALS ===
  private currentUserSig = signal<string | null>(null);
  private userRolesSig = signal<string[]>([]);
  private isAuthenticatedSig = signal<boolean>(false);
  private hasAuthorizationCodeSig = signal<boolean>(false);

  constructor(
    private router: Router,
    private injector: Injector,
    private configService: ConfigService
  ) {
   
    this.restoreSession().subscribe(); 
  }  
  private get http(): HttpClient {
    return this.injector.get(HttpClient);
  }

  // === OBSERVABLES ===
  currentUser$ = toObservable(this.currentUserSig);
  userRoles$ = toObservable(this.userRolesSig);
  isAuthenticated$ = toObservable(this.isAuthenticatedSig);
  hasAuthorizationCode$ = toObservable(this.hasAuthorizationCodeSig);

  // === COMPUTEDS ===
  currentUser = computed(() => this.currentUserSig());
  userRoles = computed(() => this.userRolesSig());
  isAuthenticated = computed(() => this.isAuthenticatedSig());
  hasAuthorizationCode = computed(() => this.hasAuthorizationCodeSig());
  isAdmin = computed(() => this.userRolesSig().includes('ADMIN'));

  setAuthorizationCodeState(state: boolean): void {
    this.hasAuthorizationCodeSig.set(state);
  }

  private normalizeRole(role: string): string {
    return role.toUpperCase().replace('ROLE_', '');
  }

  login(email: string, password: string): Observable<HttpResponse<LoginResponse>> {
    const url = `${this.configService.getApiUrl()}/auth/login`;

    return this.http.post<LoginResponse>(url, { email, password }, {
      observe: 'response',
      withCredentials: true
    }).pipe(
      tap((response) => {
        if (response.status === 200 && response.body?.role) {
          this.handleLoginSuccess(email, response.body.role);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error en login:', error);
        return throwError(() => new Error(this.extractErrorMessage(error)));
      })
    );
  }
  private handleLoginSuccess(email: string, role: string): void {
    const normalizedRole = this.normalizeRole(role);
    this.currentUserSig.set(email);
    this.userRolesSig.set([normalizedRole]);
    this.isAuthenticatedSig.set(true);
    this.router.navigate(['/dashboard']);
  }

  restoreSession(): Observable<boolean> {
    const url = `${this.configService.getApiUrl()}/auth/me`;

    return this.http.get<LoginResponse>(url, { withCredentials: true }).pipe(
      tap((user) => {
        if (user) {
          this.currentUserSig.set(user.email);
          this.userRolesSig.set([this.normalizeRole(user.role)]);
          this.isAuthenticatedSig.set(true);
          console.log('🔁 Sesión Activa !!!');
        }
      }),
      map(() => true),
      catchError((err: HttpErrorResponse) => {
        console.log('🔒 No se restauró sesión (no es grave):', err);
        this.currentUserSig.set(null);
        this.userRolesSig.set([]);
        this.isAuthenticatedSig.set(false);
        return of(false);
      })
    );
  }

  register(username: string, email: string, password: string, telefono: string, rubro: string, role: string): Observable<void> {
    const url = `${this.configService.getApiUrl()}/auth/register`;

    return this.http.post<void>(url, { username, email, password, telefono, rubro, role }, { withCredentials: true }).pipe(
      tap(() => console.log('📝 Usuario registrado exitosamente')),
      catchError((error: HttpErrorResponse) => {
        console.error('Error en registro:', error);
        return throwError(() => new Error(this.extractErrorMessage(error)));
      })
    );
  }

  logout(): Observable<void> {
    const url = `${this.configService.getApiUrl()}/auth/logout`;

    return this.http.post<void>(url, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.currentUserSig.set(null);
        this.userRolesSig.set([]);
        this.isAuthenticatedSig.set(false);
        this.hasAuthorizationCodeSig.set(false);
        this.router.navigateByUrl('/auth/login');
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error en logout:', error);
        return throwError(() => error);
      })
    );
  }

  resetPassword(token: string, password: string): Observable<void> {
    const url = `${this.configService.getApiUrl()}/auth/reset-password`;

    return this.http.post<void>(url, { token, password }, { withCredentials: true }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error en resetPassword:', error);
        return throwError(() => new Error('No se pudo restablecer la contraseña'));
      })
    );
  }

  public extractErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) return 'No se pudo conectar con el servidor.';
    if (error.status >= 500) return 'Error del servidor.';
    if (error.status === 401 || error.status === 403) return 'Credenciales incorrectas.';
    return error.error?.message || error.message || 'Error inesperado.';
  }
}
