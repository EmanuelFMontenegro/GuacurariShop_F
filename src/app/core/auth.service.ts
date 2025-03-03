import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { supabase } from '../supabase/supabaseClient';
import { AuthError, UserResponse, Session } from '@supabase/supabase-js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  login(email: string, password: string): Observable<Session | null> {
    return from(supabase.auth.signInWithPassword({ email, password })).pipe(
      switchMap((result: UserResponse) => {
        if (result.error) {
          return throwError(() => new Error(result.error.code === 'invalid_credentials' ? 'invalid_credentials' : result.error.message));
        }

        return from(supabase.auth.getSession()).pipe(
          map((sessionData) => {
            const session = sessionData?.data?.session;
            if (session) {
              document.cookie = `token=${session.access_token}; path=/; Secure; HttpOnly; SameSite=Strict`;
              this.router.navigate(['/dashboard']);
            }
            return session;
          })
        );
      }),
      catchError((error) => {
        console.error('Error al autenticar:', error);
        return throwError(() => error);
      })
    );
  }

  isAuthenticated(): Observable<boolean> {
    return from(supabase.auth.getUser()).pipe(
      map((result: UserResponse) => !!result.data.user),
      catchError(() => {
        console.warn('Usuario no autenticado.');
        return [false];
      })
    );
  }

  getRole(): Observable<string> {
    return from(supabase.auth.getUser()).pipe(
      map((result: UserResponse) => result.data.user?.user_metadata?.['role'] || ''),
      catchError(() => {
        console.warn('No se pudo obtener el rol del usuario.');
        return [''];
      })
    );
  }

  logout(): Observable<void> {
    return from(supabase.auth.signOut()).pipe(
      map(() => {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/auth/login');
      })
    );
  }
}
