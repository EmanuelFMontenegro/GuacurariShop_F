import { Component, signal } from '@angular/core';
import { AuthService } from '../../../core/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = signal(false);
  passwordVisible = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.toastr.error('Por favor, completa todos los campos correctamente.');
      return;
    }
  
    this.isLoading.set(true);
    const { email, password } = this.loginForm.value;
  
    this.authService.login(email, password).pipe(
      catchError(error => {
        this.handleLoginError(error);
        return of(null);
      })
    ).subscribe(response => {
      if (response && response.status === 200) {
        this.toastr.success('Bienvenido al Sistema');
        this.router.navigate(['/dashboard']);
      }
    }).add(() => {
      this.isLoading.set(false);
    });
  }

  private handleLoginError(error: any): void {
    const errorMessage = error?.error?.message || 'Error al iniciar sesión. Verifique sus credenciales.';
    this.toastr.error(errorMessage);
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.update(prev => !prev);
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
