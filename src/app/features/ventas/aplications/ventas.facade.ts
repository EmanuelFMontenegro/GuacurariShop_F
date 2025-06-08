import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductoBase } from '@shared/models/ProductoBase.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VentasFacade {
  private carritoSubject = new BehaviorSubject<ProductoBase[]>([]);
  carrito$ = this.carritoSubject.asObservable();

  constructor(private http: HttpClient) {}

  agregarProductoACarrito(producto: ProductoBase) {
    const carrito = [...this.carritoSubject.getValue()];
    carrito.push(producto);
    this.carritoSubject.next(carrito);
  }

  actualizarCantidadProducto(producto: ProductoBase) {
    const carrito = [...this.carritoSubject.getValue()];
    const index = carrito.findIndex(p => p.productoId === producto.productoId);
    if (index !== -1) {
      carrito[index].cantidad = producto.cantidad;
      this.carritoSubject.next(carrito);
    }
  }

  eliminarProductoDelCarrito(producto: ProductoBase) {
    const nuevoCarrito = this.carritoSubject.getValue().filter(p => p.productoId !== producto.productoId);
    this.carritoSubject.next(nuevoCarrito);
  }

  obtenerTotalVenta(): number {
    return this.carritoSubject.getValue().reduce((acc, p) => acc + (p.precioVenta * (p.cantidad ?? 1)), 0);
  }

  getProductos(): Observable<ProductoBase[]> {
    // Simulación: cambiar por llamada real al backend si hace falta
    return of([]);
  }

  realizarVenta(): Observable<{ total: number }> {
    const carrito = this.carritoSubject.getValue();

    const ventaPayload = {
      productos: carrito,
      total: this.obtenerTotalVenta(),
      fecha: new Date().toISOString()
    };

    return this.http.post<{ total: number }>('/ventas', ventaPayload).pipe(
      tap(() => {
        this.carritoSubject.next([]); // Limpiar carrito observable también
      })
    );
  }
}
