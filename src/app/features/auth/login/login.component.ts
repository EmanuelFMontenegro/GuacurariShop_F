import { Component, signal } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { Router } from '@angular/router'; 

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
        const errorMessage = this.authService.extractErrorMessage(error);
        if (errorMessage.includes('no registrado') || error.status === 404) {
         
          this.toastr.info('No estás registrado. Redirigiendo al registro...', 'Usuario no encontrado');
          this.router.navigate(['/auth/registro']);
        } else {
          this.toastr.error(errorMessage, 'Error de inicio de sesión');
        }
        return of(null); 
      }),
      finalize(() => this.isLoading.set(false)) 
    ).subscribe(response => {
      if (response && response.status === 200) {
        this.toastr.success('Login exitoso', 'Bienvenido');
      }
    });
  }
  
  togglePasswordVisibility(): void {
    this.passwordVisible.update(prev => !prev);
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

}
