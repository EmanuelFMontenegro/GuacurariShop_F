import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from '../shared/models/ProductoBase.model';
import { Factura } from '../shared/models/Factura.model';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private facturas: Factura[] = [];
  private facturasSubject = new BehaviorSubject<Factura[]>(this.facturas);

  
  getFacturas() {
    return this.facturasSubject.asObservable();
  }

  
  generarFactura(productos: Producto[], total: number, fecha: Date) {
    const nuevaFactura: Factura = {
      id: this.generateId(),
      productos,
      total,
      fecha
    };
    this.facturas.push(nuevaFactura);
    this.facturasSubject.next(this.facturas);
  }

  
  private generateId(): string {
    return 'F' + Math.floor(Math.random() * 1000000).toString();
  }
}
