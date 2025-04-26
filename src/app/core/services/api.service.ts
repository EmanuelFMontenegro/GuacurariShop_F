import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';

import { VarianteProducto } from '../../shared/models/variante-producto.model';


import { v4 as uuidv4 } from 'uuid';
import { Producto } from '../../shared/models/Producto.model';
import { Cliente } from '../../shared/models/Cliente.model';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly API_URL = environment.apiUrl;
  
  constructor(private http: HttpClient) {}

  
  registerCliente(email: string, password: string, telefono: string,role:string): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.API_URL}/clientes`, { email, password, telefono,role });
  }

  
  getVariantesPorProducto(productoId: string): Observable<VarianteProducto[]> {
    return this.http.get<VarianteProducto[]>(`${this.API_URL}/variantes_producto?producto_id=${productoId}`);
  }

  
  agregarProducto(producto: Omit<Producto, 'id'>): Observable<Producto> {
    const productoConUuid = {
      ...producto,
      id: uuidv4(),
    };
    return this.http.post<Producto>(`${this.API_URL}/productos`, productoConUuid);
  }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.API_URL}/productos`);
  }

  
  editarProducto(id: string, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.API_URL}/productos/${id}`, producto);
  }


  eliminarProducto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/productos/${id}`);
  }  
}
