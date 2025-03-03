import { Component } from '@angular/core';
import { ApiService } from '../../../core/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { supabase } from '../../../supabase/supabaseClient';

@Component({
  standalone: true,
  selector: 'app-registro',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent {
  email: string = '';
  password: string = '';
  passwordVisible: boolean = false;
  isLoading: boolean = false;
  telefono: string = '';
  rubro: string = 'Kiosko';  // Valor inicial del rubro
  roleName: string = 'empleado';  // Valor por defecto del rol (puedes cambiarlo según lo que necesites)

  constructor(private apiService: ApiService, private toastr: ToastrService, private router: Router) {}

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  // Función para registrar un nuevo cliente con su rol específico
  registerCliente() {
    this.isLoading = true;
  
    supabase.auth.signUp({ email: this.email, password: this.password }).then(({ data, error }) => {
      this.isLoading = false;
  
      if (error) {
        this.toastr.error(error.message, 'Error al registrar en Supabase');
        return;
      }
  
      if (data.user) {
        // Obtener el ID del rol
        supabase
          .from('roles')
          .select('id')
          .eq('name', this.roleName) // Asignar el rol según el valor roleName
          .single()
          .then(({ data: roleData, error: roleError }) => {
            if (roleError) {
              this.toastr.error(roleError.message, 'Error al obtener el rol');
              return;
            }

            // Insertar cliente en la base de datos con el rol
            supabase
              .from('clientes')
              .insert([
                {
                  email: this.email,
                  password: this.password,
                  telefono: this.telefono,
                  rubro: this.rubro,
                  role_id: roleData?.id,  // Asignar el ID del rol al cliente
                }
              ])
              .then(({ error }) => {
                if (error) {
                  this.toastr.error(error.message, 'Error al guardar cliente en la base de datos');
                } else {
                  this.toastr.success('Registro exitoso. Revisa tu correo para confirmar.', '¡Bienvenido!');
                  this.router.navigate(['/login']);
                }
              });
          });
      }
    });
  }
}
