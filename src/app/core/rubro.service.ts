import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface Rubro {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root',
})
export class RubroService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/rubros`;

  rubros = signal<Rubro[]>([]); 

  constructor() {
    this.loadRubros();
  }

  loadRubros(): void {
    this.http.get<Rubro[]>(this.baseUrl).subscribe({
      next: (data) => this.rubros.set(data),
      error: (err) => console.error('Error cargando rubros:', err),
    });
  }

  getRubros(): Observable<string[]> {
    return this.http.get<Rubro[]>(this.baseUrl).pipe(
      map(rubros => rubros.map(rubro => rubro.nombre)) 
    );
  }
  
  getRubroByNombre(nombre: string): Observable<string> {
    return this.http.get(`${this.baseUrl}/${nombre}`, {
      responseType: 'text',
    });
  }

  addRubro(nombre: string): Observable<string> {
    return this.http.post(this.baseUrl, nombre, {
      responseType: 'text',
    });
  }
}
