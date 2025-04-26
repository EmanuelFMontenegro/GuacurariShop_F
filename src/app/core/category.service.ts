import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '@environments/environment';

// Interface que corresponde a la entidad Categoria del backend
export interface Categoria {
  id?: number;
  nombre: string;
  descripcion?: string;
  // Agrega aquí otros campos que tenga la entidad Categoria en tu backend
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categorias`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Obtener todas las categorías
  getCategories(): Observable<Categoria[]> {
    return this.authService.getUser().pipe(
      switchMap(user => {
        if (!user) {
          return of([]);
        }
        
        // Utilizamos el token del usuario si es necesario para la autenticación
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${user.token}`
        });
        
        return this.http.get<Categoria[]>(this.apiUrl, { headers })
          .pipe(
            catchError(error => {
              console.error('Error al obtener categorías:', error);
              return of([]);
            })
          );
      })
    );
  }

  // Obtener una categoría por ID
  getCategoryById(id: number): Observable<Categoria | null> {
    return this.authService.getUser().pipe(
      switchMap(user => {
        if (!user) {
          return of(null);
        }
        
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${user.token}`
        });
        
        return this.http.get<Categoria>(`${this.apiUrl}/${id}`, { headers })
          .pipe(
            catchError(error => {
              console.error(`Error al obtener la categoría con ID ${id}:`, error);
              return of(null);
            })
          );
      })
    );
  }

  // Crear una nueva categoría
  createCategory(categoria: Categoria): Observable<Categoria | null> {
    return this.authService.getUser().pipe(
      switchMap(user => {
        if (!user) {
          return of(null);
        }
        
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        });
        
        return this.http.post<Categoria>(this.apiUrl, categoria, { headers })
          .pipe(
            catchError(error => {
              console.error('Error al crear la categoría:', error);
              return of(null);
            })
          );
      })
    );
  }

  // Eliminar una categoría
  deleteCategory(id: number): Observable<boolean> {
    return this.authService.getUser().pipe(
      switchMap(user => {
        if (!user) {
          return of(false);
        }
        
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${user.token}`
        });
        
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers })
          .pipe(
            switchMap(() => of(true)),
            catchError(error => {
              console.error(`Error al eliminar la categoría con ID ${id}:`, error);
              return of(false);
            })
          );
      })
    );
  }
}