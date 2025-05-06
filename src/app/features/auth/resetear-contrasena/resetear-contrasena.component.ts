import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-resetear-contrasena',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './resetear-contrasena.component.html',
  styleUrls: ['./resetear-contrasena.component.scss'],
})
export class ResetearContrasenaComponent implements OnInit {
  resetForm: FormGroup;
  isLoading = signal(false);  // Signal para manejar el estado de carga
  passwordVisible = signal(false);  // Signal para controlar la visibilidad de la contraseña
  token: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.resetForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  ngOnInit(): void {
    const cookieToken = this.cookieService.get('recovery_token');
    if (!cookieToken) {
      this.toastr.error('Token inválido o expirado');
      this.router.navigate(['/auth/login']);
      return;
    }
    this.token = cookieToken;
    this.validarToken(cookieToken);
  }

  private validarToken(token: string): void {
    this.authService.validateResetToken(token).subscribe({
      next: () => {
        this.cookieService.set('recovery_token', token, 1, '/', '', true, 'Strict');
        this.token = token;
      },
      error: () => {
        this.toastr.error('Token inválido o expirado');
        this.router.navigate(['/auth/login']);
      }
    });
  }

  resetPassword(): void {
    if (this.resetForm.invalid || !this.token) return;
  
    this.isLoading.set(true);
    const { password } = this.resetForm.value;
  
    this.authService.resetPassword(password, this.token).subscribe({
      next: () => {
        this.toastr.success('Contraseña restablecida correctamente.');
        this.cookieService.delete('recovery_token', '/');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        const errorMsg = err.status === 400
          ? 'Token inválido o expirado.'
          : 'Error al restablecer la contraseña.';
        this.toastr.error(errorMsg);
      },
      complete: () => this.isLoading.set(false),
    });
  }
  


  passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.update(prev => !prev);
  }

  get password() {
    return this.resetForm.get('password');
  }

  get confirmPassword() {
    return this.resetForm.get('confirmPassword');
  }
}
