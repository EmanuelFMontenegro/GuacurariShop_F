// import { Injectable } from '@angular/core';
// import { AuthService } from './auth.service';
// import { Observable, of } from 'rxjs';
// import { switchMap } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root',
// })
// export class CategoryService {
//   constructor(private authService: AuthService) {}

//   getCategories() {
//     return this.authService.getUser().pipe(
//       switchMap(user => {
//         if (!user) {
//           return of([]);  // Si no hay usuario, retornamos un array vacío (o manejas el caso como desees)
//         }
//         return this.getCategoriesForUser(user.id); // Aquí accedes al id del usuario
//       })
//     );
//   }

//   insertCategory(name: string): Observable<any> {
//     return this.authService.getUser().pipe(
//       switchMap(user => {
//         if (!user) {
//           return of(null);  // Manejo cuando no hay usuario
//         }
//         return this.insertCategoryForUser(user.id, name); // Usamos el id del usuario
//       })
//     );
//   }

//   private getCategoriesForUser(userId: string): Observable<any> {
//     // Lógica para obtener las categorías basadas en el userId
//     return of([]);  // Esto es solo un ejemplo, deberías hacer la consulta real
//   }

//   private insertCategoryForUser(userId: string, name: string): Observable<any> {
//     // Lógica para insertar la categoría basada en el userId
//     return of({});  // Esto es solo un ejemplo, deberías hacer la inserción real
//   }
// }
