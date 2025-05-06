import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalcularTotalService {
  calcularTotal(ventas: any[]): number {
    return ventas.reduce((total, venta) => total + venta.precio, 0);
  }
}