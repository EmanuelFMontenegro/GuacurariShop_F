import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  codigoBarras: string;
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent {
  productos: Producto[] = [
    { id: 1, nombre: 'Coca Cola 500ml', precio: 250, stock: 30, codigoBarras: '7791234567890' },
    { id: 2, nombre: 'Papas Lays', precio: 450, stock: 15, codigoBarras: '7799876543210' }
  ];

  nuevoProducto: Producto = { id: 0, nombre: '', precio: 0, stock: 0, codigoBarras: '' };

  agregarProducto() {
    if (this.nuevoProducto.nombre && this.nuevoProducto.precio > 0) {
      this.nuevoProducto.id = this.productos.length + 1;
      this.productos.push({ ...this.nuevoProducto });
      this.nuevoProducto = { id: 0, nombre: '', precio: 0, stock: 0, codigoBarras: '' };
    }
  }

  eliminarProducto(id: number) {
    this.productos = this.productos.filter(p => p.id !== id);
  }
}
