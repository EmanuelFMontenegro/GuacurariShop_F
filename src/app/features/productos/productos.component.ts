import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../shared/models/Producto.model';
import { ApiService } from '../../core/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  nuevoProducto: Producto = this.resetFormulario();

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.apiService.getProductos().subscribe({
      next: (data) => this.productos = data,
      error: (err) => {
        console.error('💥 Error al cargar productos:', err);
        this.toastr.error('No se pudieron cargar los productos 😓');
      }
    });
  }

  agregarProducto(): void {
    const productoParaAgregar: Producto = {
      ...this.nuevoProducto,
      productoId: uuidv4()
    };

    this.apiService.agregarProducto(productoParaAgregar)
      .pipe(
        catchError(err => {
          console.error('❌ Error al agregar producto:', err);
          this.toastr.error('No se pudo agregar el producto 🤕');
          return of(null);
        })
      )
      .subscribe((productoAgregado) => {
        if (productoAgregado) {
          this.productos.push(productoAgregado);
          this.nuevoProducto = this.resetFormulario();
          this.toastr.success('Producto agregado exitosamente 🎉');
        }
      });
  }

  eliminarProducto(productoId: string): void {
    this.apiService.eliminarProducto(productoId).subscribe({
      next: () => {
        this.productos = this.productos.filter(p => p.productoId !== productoId);
        this.toastr.success('Producto eliminado ✅');
      },
      error: (err) => {
        console.error('🗑️ Error al eliminar producto:', err);
        this.toastr.error('Error al eliminar el producto 🛑');
      }
    });
  }

  private resetFormulario(): Producto {
    return {
      productoId: '',
      nombre: '',
      precio: 0,
      precioCompra: 0,
      precioVenta: 0,
      stock: 0,
      categoria: '',
      codigoBarras: '',
      modoEdicion: false
    };
  }
}
