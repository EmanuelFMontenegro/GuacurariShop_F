// ventas.facade.ts
import { Injectable } from '@angular/core';
import { Producto } from '../../shared/models/Producto.model';
import { Venta } from '../../models/venta.model';

@Injectable({
  providedIn: 'root'
})
export class VentasFacade {
  private venta: Venta;

  constructor() {
    this.venta = new Venta('Cliente Ejemplo');
  }

  getProductos(): Producto[] {
    // Aquí deberías obtener los productos desde el backend o un servicio
    return []; // Retorna los productos disponibles
  }

  agregarProductoACarrito(producto: Producto) {
    this.venta.agregarProducto(producto);
  }

  obtenerTotalVenta(): number {
    return this.venta.total();
  }

  realizarVenta() {
    const detallesVenta = this.venta.obtenerDetalles();
    // Aquí puedes llamar a un servicio para guardar la venta en la base de datos
    return detallesVenta;
  }

  eliminarProductoDelCarrito(producto: Producto) {
    this.venta['productos'] = this.venta['productos'].filter(p => p.productoId !== producto.productoId);
  }
}
