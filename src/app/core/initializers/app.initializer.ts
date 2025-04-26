import { inject } from "@angular/core";
import { AuthService } from "@core/services/auth.service";
import { catchError, firstValueFrom, of } from "rxjs";

export function appInitializerFactory(): () => Promise<boolean> {
  return async () => {
    const authService = inject(AuthService);

    try {
      const sessionRestored: boolean = await firstValueFrom(
        authService.restoreSession().pipe(
          catchError(() => {
            console.debug('No se pudo restaurar la sesión'); 
            return of(false);
          })
        )
      );

      return sessionRestored;

    } catch (error) {
      console.error('Error al intentar restaurar la sesión:', error);
      return false;
    }
  };
}
