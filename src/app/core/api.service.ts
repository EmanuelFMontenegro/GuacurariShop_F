import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { supabase } from '../supabase/supabaseClient';
import { VarianteProducto } from './models/variante-producto.model';

export interface Cliente {
  email: string;
  password: string;
  telefono: string;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly CLIENTE_ACTIVO = 'activo';
  private readonly TABLE_VARIANTES = 'variantes_producto';
  private readonly TABLE_CLIENTES = 'clientes';

  registerCliente(email: string, password: string, telefono: string): Observable<Cliente> {
    return from(
      supabase
        .from('clientes')
        .insert([{ email, password, telefono, status: this.CLIENTE_ACTIVO }])
        .select()
        .single()
    ).pipe(
      map(({ data }) => data as Cliente),
      catchError((error) => {
        console.error('Error al registrar cliente:', error);
        throw error;
      })
    );
  }

  getVariantesPorProducto(productoId: string): Observable<VarianteProducto[]> {
    return from(
      supabase
        .from(this.TABLE_VARIANTES)
        .select('*')
        .eq('producto_id', productoId)
    ).pipe(
      map(({ data }) => (data as VarianteProducto[]) || []),
      catchError((error) => {
        console.error('Error al obtener variantes del producto:', error);
        return [[]]; // Retorna un array vacío en caso de error
      })
    );
  }
}
