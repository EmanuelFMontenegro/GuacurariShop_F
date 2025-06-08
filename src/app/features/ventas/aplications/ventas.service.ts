import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta } from '../domain/models/venta.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private baseUrl = `${environment.apiUrl}/ventas`;  // Usar apiUrl del environment

  constructor(private http: HttpClient) {}

  // Método para realizar una venta
  realizarVenta(venta: Venta): Observable<Venta> {
    return this.http.post<Venta>(this.baseUrl, venta);  // Enviar la venta al backend
  }
}
