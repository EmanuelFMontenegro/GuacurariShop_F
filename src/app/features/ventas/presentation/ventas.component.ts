// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ProductoBase } from '@shared/models/ProductoBase.model';
// import { ToastrService } from 'ngx-toastr';
// import { VentasFacade } from '../aplications/ventas.facade';
// import { Observable } from 'rxjs';

// @Component({
//   selector: 'app-ventas',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './ventas.component.html',
//   styleUrls: ['./ventas.component.scss']
// })
// export class VentasComponent implements OnInit {
//   productos$: Observable<ProductoBase[]>;
//   totalVenta: number = 0;
//   selectedProduct: ProductoBase | null = null;

//   constructor(
//     public ventasFacade: VentasFacade,
//     private toast: ToastrService
//   ) {
//     this.productos$ = this.ventasFacade.getProductos();
//   }

//   ngOnInit() {
//     this.actualizarTotal();
//   }

//   onBarcodeInput(event: Event) {
//     const input = event.target as HTMLInputElement;
//     if (input.value.length >= 13) {
//       this.buscarPorCodigoBarras(input.value);
//       input.value = '';
//     }
//   }

//   private buscarPorCodigoBarras(codigo: string) {
//     this.productos$.subscribe(productos => {
//       const productoEncontrado = productos.find(p => p.productoId === codigo);
//       if (productoEncontrado) {
//         this.agregarAlCarrito(productoEncontrado);
//       } else {
//         this.toast.warning('Producto no encontrado', 'Aviso');
//       }
//     });
//   }

//   agregarAlCarrito(producto: ProductoBase) {
//     this.ventasFacade.agregarProductoACarrito({...producto, cantidad: 1});
//     this.actualizarTotal();
//   }

//   actualizarSubtotal(item: ProductoBase): number {
//     return item.precioVenta * (item.cantidad || 1);
//   }

//   actualizarCantidad(item: ProductoBase) {
//     this.ventasFacade.actualizarCantidadProducto(item);
//     this.actualizarTotal();
//   }

//   removeItem(producto: ProductoBase): void {
//     this.ventasFacade.eliminarProductoDelCarrito(producto);
//     this.actualizarTotal();
//   }

//   realizarVenta() {
//     if (this.ventasFacade.obtenerTotalVenta() > 0) {
//       this.ventasFacade.realizarVenta().subscribe({
//         next: (respuesta) => {
//           this.toast.success(`Venta realizada. Total: $${respuesta.total}`, 'Éxito');
//           this.actualizarTotal();
//         },
//         error: (error) => {
//           this.toast.error('Error al procesar la venta', 'Error');
//         }
//       });
//     } else {
//       this.toast.warning('No hay productos en el carrito', 'Aviso');
//     }
//   }

//   private actualizarTotal() {
//     this.totalVenta = this.ventasFacade.obtenerTotalVenta();
//   }
// }