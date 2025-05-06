import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from '../shared/models/ProductoBase.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private productos: Producto[] = [];
  private stockSubject = new BehaviorSubject<Producto[]>(this.productos);


  getInventario() {
    return this.stockSubject.asObservable();
  }

  
  agregarProducto(producto: Producto) {
    this.productos.push(producto);
    this.stockSubject.next(this.productos);
  }

 
  actualizarStock(productoId: string, cantidad: number) {
    const producto = this.productos.find(p => p.id === productoId);
    if (producto) {
      producto.stock += cantidad;
      this.stockSubject.next(this.productos);
    }
  }
}
