// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { FacturaService } from '../../core/factura.service';
// import { Producto, ProductoFactura } from '../../shared/models/Producto.model';
// // import { ProductoService } from '../../core/producto.service';

// @Component({
//   selector: 'app-ventas',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './ventas.component.html',
//   styleUrls: ['./ventas.component.scss']
// })
// export class VentasComponent implements OnInit {
//   selectedProduct: Producto | null = null;
//   productos: Producto[] = [];
//   carrito: Producto[] = [];
//   totalVenta: number = 0;

//   constructor( private facturaService: FacturaService) {}

//   // ngOnInit() {
//   //   this.productoService.getProductos().subscribe((productos) => {
//   //     this.productos = productos;
//   //   });
//   // }

//   agregarAlCarrito(producto: Producto) {
//     const productoEnCarrito = this.carrito.find(p => p.id === producto.id);

//     if (productoEnCarrito) {
//       productoEnCarrito.cantidad = (productoEnCarrito.cantidad ?? 0) + 1;
//     } else {
//       this.carrito.push({ ...producto, cantidad: 1 });
//     }

//     this.calcularTotal();
//   }

//   calcularTotal() {
//     this.totalVenta = this.carrito.reduce(
//       (total, producto) => total + producto.precioVenta * (producto.cantidad ?? 0),
//       0
//     );
//   }

//   realizarVenta() {
//     if (this.carrito.length > 0) {
//       const fechaVenta = new Date();
//       const productosParaFactura: ProductoFactura[] = this.carrito.map(producto => ({
//         id: producto.id,
//         nombre: producto.nombre,
//         precio: producto.precioVenta,
//         precioCompra: producto.precioCompra,
//         precioVenta: producto.precioVenta,
//         stock: producto.stock,
//         categoria: producto.categoria,
//         modoEdicion: false
//       }));

//       this.facturaService.generarFactura(productosParaFactura, this.totalVenta, fechaVenta);

//       const total = this.totalVenta;

//       this.carrito = [];
//       this.totalVenta = 0;

//       alert(`Venta realizada. Total: $${total}. Factura generada con éxito.`);
//     } else {
//       alert('No hay productos en el carrito');
//     }
//   }

//   removeItem(producto: Producto): void {
//     this.carrito = this.carrito.filter(item => item.id !== producto.id);
//     this.calcularTotal();
//   }

//   onBarcodeInput(event: any) {
//     const codigo = event.target.value.trim();
//     const producto = this.productos.find(p => p.id === codigo);

//     if (producto) {
//       this.agregarAlCarrito({ ...producto, cantidad: producto.cantidad ?? 1 });
//     } else {
//       alert("Producto no encontrado");
//     }
//   }
// }
