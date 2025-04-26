import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacturaService } from '../../core/factura.service';
import { Producto, ProductoFactura } from '../../shared/models/Producto.model';
// Acá asumimos que tenés un servicio de toast
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {
  selectedProduct: string = '';
  productos: Producto[] = [];
  carrito: Producto[] = [];
  totalVenta: number = 0;

  constructor(
    private facturaService: FacturaService,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    // TODO: cargar productos
  }

  agregarAlCarrito(producto: Producto) {
    const productoEnCarrito = this.carrito.find(p => p.productoId === producto.productoId);

    if (productoEnCarrito) {
      productoEnCarrito.cantidad = (productoEnCarrito.cantidad ?? 0) + 1;
    } else {
      this.carrito.push({ ...producto, cantidad: 1 });
    }

    this.calcularTotal();
  }

  calcularTotal() {
    this.totalVenta = this.carrito.reduce(
      (total, producto) => total + producto.precioVenta * (producto.cantidad ?? 0),
      0
    );
  }

  realizarVenta() {
    if (this.carrito.length > 0) {
      const fechaVenta = new Date();
      const productosParaFactura: ProductoFactura[] = this.carrito.map(producto => ({
        productoId: producto.productoId,
        nombre: producto.nombre,
        precio: producto.precio ?? 0,
        precioCompra: producto.precioCompra,
        precioVenta: producto.precioVenta,
        stock: producto.stock,
        categoria: producto.categoria,
        modoEdicion: false
      }));

      try {
        this.facturaService.generarFactura(productosParaFactura, this.totalVenta, fechaVenta);
        this.toast.success(`Venta realizada. Total: $${this.totalVenta}`, 'Éxito');
        this.carrito = [];
        this.totalVenta = 0;
      } catch (error) {
        console.error('Error al generar factura:', error);
        this.toast.error('Error al realizar la venta', 'Error');
      }
    } else {
      this.toast.warning('No hay productos en el carrito', 'Aviso');
    }
  }

  removeItem(producto: Producto): void {
    this.carrito = this.carrito.filter(item => item.productoId !== producto.productoId);
    this.calcularTotal();
  }

  onBarcodeInput(event: any) {
    const codigo = event.target.value.trim();
    const producto = this.productos.find(p => p.productoId === codigo);

    if (producto) {
      this.agregarAlCarrito({ ...producto, cantidad: producto.cantidad ?? 1 });
    } else {
      this.toast.error("Producto no encontrado", 'Error');
    }
  }
  
  actualizarSubtotal(producto: Producto): number {
    return (producto.precioVenta ?? 0) * (producto.cantidad ?? 0);
  }
  
  buscarProductoPorNombre() {
    const match = this.productos.find(p => 
      p.nombre.toLowerCase().includes(this.selectedProduct.toLowerCase())
    );

    if (match) {
      this.agregarAlCarrito(match);
    } else {
      this.toast.warning('Producto no encontrado por nombre', 'Oops');
    }
  }
}
