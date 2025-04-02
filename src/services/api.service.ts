// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../environments/environment';
// import { signal, Signal } from '@angular/core'; // Importar Signal
// import { StoreService } from './store.service';
// import { catchError, map } from 'rxjs/operators';
// import { Observable } from 'rxjs';

// // Definición de tipos para el login y recuperación de contraseñas
// interface LoginRequest {
//   email: string;
//   password: string;
// }

// interface RegisterRequest {
//   name: string;
//   email: string;
//   password: string;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class ApiService {
//   private apiUrl = environment.apiUrl;


//   private authToken = signal<string | null>(localStorage.getItem('authToken')); 
//   private userData = signal<any>(null);

//   readonly isAuthenticated: Signal<string | null> = this.authToken;

  
//   readonly currentUser: Signal<any> = this.userData;

//   constructor(private http: HttpClient, private storeService: StoreService) {}

 
//   login(email: string, password: string): Observable<any> {
//     const loginData: LoginRequest = { email, password };
//     return this.http.post(`${this.apiUrl}/auth/login`, loginData).pipe(
//       map((response: any) => {
//         // Guardar el token y los datos del usuario en signals
//         this.authToken.set(response.token);
//         this.userData.set(response.user);

//         // Guardar el token en localStorage para que esté disponible en futuras solicitudes
//         localStorage.setItem('authToken', response.token);

//         // Actualizamos el StoreService con los datos
//         this.storeService.setStoreData({
//           token: response.token,
//           user: response.user,
//         });

//         return response;
//       }),
//       catchError((error) => {
//         console.error('Login failed:', error);
//         throw error;
//       })
//     );
//   }

//   // **Register**: Registra un nuevo usuario
//   register(name: string, email: string, password: string): Observable<any> {
//     const registerData: RegisterRequest = { name, email, password };
//     return this.http.post(`${this.apiUrl}/auth/register`, registerData).pipe(
//       map((response) => {
//         return response;
//       }),
//       catchError((error) => {
//         console.error('Registration failed:', error);
//         throw error;
//       })
//     );
//   }

//   // **Password Recovery**: Recupera la contraseña del usuario
//   recoverPassword(email: string): Observable<any> {
//     return this.http.post(`${this.apiUrl}/auth/recover-password`, { email }).pipe(
//       map((response) => {
//         return response;
//       }),
//       catchError((error) => {
//         console.error('Password recovery failed:', error);
//         throw error;
//       })
//     );
//   }

//   // **Change Password**: Cambia la contraseña del usuario
//   changePassword(token: string, newPassword: string): Observable<any> {
//     const data = { token, newPassword };
//     return this.http.post(`${this.apiUrl}/auth/change-password`, data).pipe(
//       map((response) => {
//         return response;
//       }),
//       catchError((error) => {
//         console.error('Change password failed:', error);
//         throw error;
//       })
//     );
//   }

//   // **Logout**: Limpia el estado de autenticación
//   logout(): void {
//     this.authToken.set(null);
//     this.userData.set(null);
    
//     // Limpiar los datos en localStorage
//     localStorage.removeItem('authToken');

//     // Limpiar los datos en el StoreService
//     this.storeService.setStoreData(null);
//   }

//   // Método para acceder a los datos desde el StoreService
//   getStoreData() {
//     return this.storeService.getStoreData();
//   }
// }
