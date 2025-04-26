import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { RubroService } from '@core/rubro.service';

@Component({
  standalone: true,
  selector: 'app-registro',
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent implements OnInit {
  registerForm: FormGroup;
  passwordVisible: boolean = false;
  isLoading: boolean = false;
  rubros: string[] = [];
  role: string = 'ADMIN';
  errorMsg: string = '';
  esPrimerRegistro: boolean = true;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private rubroService: RubroService
  ) {
    this.registerForm = this.fb.group({
      registerUsername: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      registerPassword: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      rubro: ['Kiosko', Validators.required]
    });
  }

  ngOnInit(): void {
    this.resetForm();
    this.cargarRubros();
  }

  private resetForm(): void {
    this.registerForm.reset({
      registerUsername: '',
      email: '',
      registerPassword: '',
      telefono: '',
      rubro: 'Kiosko'
    });
  }

  private cargarRubros() {
    this.rubroService.getRubros().subscribe({
      next: (data) => (this.rubros = data),
      error: (err) => console.error('Error al cargar rubros', err),
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  registerCliente() {
    this.submitted = true;
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      this.toastr.warning('Debe completar todo el formulario correctamente.', 'Atención !!!');
      return;
    }

    this.isLoading = true;
    
    const { 
      registerUsername: username, 
      email, 
      registerPassword: password, 
      telefono, 
      rubro 
    } = this.registerForm.value;

    this.authService.register(username, email, password, telefono, rubro, this.role).subscribe({
      next: () => {
        const mensaje = this.esPrimerRegistro
          ? 'Admin registrado exitosamente. ¡Bienvenido!'
          : 'Registro exitoso. Revisa tu correo para confirmar.';

        this.toastr.success(mensaje, '¡Éxito!');
        this.router.navigate(['/auth/login']);
        this.resetForm();
        this.submitted = false;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastr.error(err.message || 'Error en el registro', 'Error');
        console.error('Error:', err);
        this.errorMsg = err.message;
        this.isLoading = false;
      }
    });
  }

  soloNumeros(event: KeyboardEvent): void {
    const charCode = event.key;
    if (!/^[0-9]$/.test(charCode)) {
      event.preventDefault();
    }
  }
}