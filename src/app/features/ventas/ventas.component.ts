import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Definir interfaces para seguridad de tipos
interface Producto {
  id: number;
  nombre: string;
  precio: number;
}

interface ProductoEnCarrito extends Producto {
  cantidad: number; // Añadir cantidad
}

@Component({
  selector: 'app-ventas',
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent {
  // Productos disponibles
  productos: Producto[] = [
    { id: 1, nombre: 'Producto 1', precio: 100 },
    { id: 2, nombre: 'Producto 2', precio: 200 },
    { id: 3, nombre: 'Producto 3', precio: 300 },
  ];

  // Carrito de compras (usando la interfaz ProductoEnCarrito)
  carrito: ProductoEnCarrito[] = [];
  totalVenta: number = 0;
  selectedProduct: Producto | null = null;
  
  // Modal y producto nuevo
  newProduct: Producto = { id: 0, nombre: '', precio: 0 }; // Aquí declaramos el nuevo producto
  showProductModal: boolean = false; // Controla la visibilidad del modal

  // Agregar producto al carrito
  agregarAlCarrito(producto: Producto) {
    const productoEnCarrito: ProductoEnCarrito = {
      ...producto,
      cantidad: 1, // Inicializamos con cantidad 1
    };
    this.carrito.push(productoEnCarrito);
    this.calcularTotal();
  }

  // Calcular total de la venta
  calcularTotal() {
    this.totalVenta = this.carrito.reduce(
      (total, producto) => total + producto.precio * producto.cantidad,
      0
    );
  }

  // Realizar la venta
  realizarVenta() {
    if (this.carrito.length > 0) {
      alert(`Venta realizada. Total: $${this.totalVenta}`);
      this.carrito = [];
      this.totalVenta = 0;
    } else {
      alert('No hay productos en el carrito');
    }
  }

  // Escanear código de barras
  escanearCodigo(codigo: string) {
    const productoEncontrado = this.productos.find(
      (p) => p.id.toString() === codigo
    );
    if (productoEncontrado) {
      this.agregarAlCarrito(productoEncontrado);
    } else {
      alert('Producto no encontrado');
    }
  }

  // Evento de entrada del código de barras
  onBarcodeInput(event: any) {
    const codigo = event.target.value;
    this.escanearCodigo(codigo);
  }

  // Eliminar un producto del carrito
  removeItem(item: ProductoEnCarrito) {
    this.carrito = this.carrito.filter((p) => p !== item);
    this.calcularTotal();
  }

  // Completar la venta
  completeSale() {
    this.realizarVenta();
  }

  // Guardar nuevo producto
  saveNewProduct() {
    if (this.newProduct.nombre && this.newProduct.precio) {
      this.productos.push({ ...this.newProduct, id: this.productos.length + 1 });
      this.newProduct = { id: 0, nombre: '', precio: 0 }; // Resetear nuevo producto
      this.showProductModal = false; // Cerrar el modal
    } else {
      alert('Por favor, complete todos los campos.');
    }
  }
}
