import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recuperar-contrasena.component.html',
  styleUrl: './recuperar-contrasena.component.scss'
})
export class RecuperarContrasenaComponent {

  email = signal<string>('');
  errorMessage = signal<string | null>(null);
  resetPasswordState = signal<'idle' | 'loading' | 'success' | 'error'>('idle');

  isLoading = computed(() => this.resetPasswordState() === 'loading');

  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  recoverPassword(): void {
    if (!this.validateEmail(this.email())) {
      this.errorMessage.set('Por favor, ingresa un correo válido.');
      return;
    }

    this.errorMessage.set(null);
    this.resetPasswordState.set('loading');

    this.authService.recoverPassword(this.email())
      .pipe(
        catchError((error) => {
          console.error('Error en recoverPassword:', error);
          this.toastr.error('No pudimos enviar el correo de recuperación. Intenta de nuevo.');
          this.resetPasswordState.set('error');
          return of(); // Seguimos el flujo
        }),
        finalize(() => {
          if (this.resetPasswordState() === 'loading') {
            this.resetPasswordState.set('idle'); // Volvemos a idle si no fue success ni error
          }
        })
      )
      .subscribe({
        next: () => {
          console.log('📧 Email de recuperación enviado.');
          this.toastr.success('Te enviamos un correo para recuperar tu contraseña.');
          this.resetPasswordState.set('success');
        }
      });
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
  }
}
