// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { Producto } from '../shared/models/Producto.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProductoService {
//   private productos: Producto[] = [];

//   private productosSubject = new BehaviorSubject<Producto[]>(this.productos);

//   constructor() {
//     // Simulación de carga inicial (esto podría venir de una API)
//     setTimeout(() => {
//       this.productos = [
//         { id: '1', nombre: 'Producto A', precioCompra: 50, precioVenta: 100, stock: 10, categoria: 'General', cantidad: 0 },
//         { id: '2', nombre: 'Producto B', precioCompra: 30, precioVenta: 60, stock: 15, categoria: 'General', cantidad: 0 }
//       ];
//       this.productosSubject.next(this.productos);
//     }, 1000);
//   }

//   getProductos(): Observable<Producto[]> {
//     return this.productosSubject.asObservable();
//   }

//   agregarProducto(producto: Producto) {
//     this.productos.push(producto);
//     this.productosSubject.next(this.productos);
//   }
// }
