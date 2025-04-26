import { Component,signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-resetear-contrasena',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './resetear-contrasena.component.html',
  styleUrls: ['./resetear-contrasena.component.scss'],
})
export class ResetearContrasenaComponent {
  resetForm: FormGroup;
  isLoading = signal(false);
  passwordVisible = signal(false);
  token = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });

    this.route.queryParams.subscribe(params => {
      this.token.set(params['token'] || null);
    });
  }

  async resetPassword(): Promise<void> {
    if (this.resetForm.invalid || !this.token()) return;
    
    this.isLoading.set(true);
    try {
      const { password } = this.resetForm.value;
      await this.authService.resetPassword(this.token()!, password).toPromise();
      this.toastr.success('Contraseña restablecida correctamente.');
      this.router.navigate(['/auth/login']);
    } catch (error) {
      this.toastr.error('Error al restablecer la contraseña.');
    } finally {
      this.isLoading.set(false);
    }
  }

  passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.update(prev => !prev);
  }

  get password() { return this.resetForm.get('password'); }
  get confirmPassword() { return this.resetForm.get('confirmPassword'); }
}
