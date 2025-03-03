import { Component } from '@angular/core';
import { AuthService } from '../../../core/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'; // Importa el servicio Toastr
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  passwordVisible: boolean = false;

  constructor(private authService: AuthService, private toastr: ToastrService) {}

  login(): void {
    this.isLoading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        // Solo si el login es exitoso, mostramos el mensaje de éxito
        console.log('Usuario autenticado:', user);
        this.isLoading = false;
        this.toastr.success('Bienvenido, sesión iniciada correctamente.');
      },
      error: (error: any) => {
        this.isLoading = false;

        // Logueamos el error para ver qué se está capturando
        console.log('Error recibido en el componente:', error);

        // Verificamos si el error es 'invalid_credentials'
        if (error.message === 'invalid_credentials') {
          this.toastr.error('Correo o contraseña incorrectos. Por favor, revisa tus datos e intenta nuevamente.');
        } else {
          // En caso de cualquier otro error
          this.toastr.error('Hubo un error al iniciar sesión. Intenta nuevamente.');
        }
      }
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}