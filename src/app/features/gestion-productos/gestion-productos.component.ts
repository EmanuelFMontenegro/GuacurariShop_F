import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Producto } from '../../shared/models/ProductoBase.model';
import CategoryService
import { Category } from '../../shared/models/Category.model';
import { ApiService } from '../../core/services/api.service';
import { AgregarItemDialogComponent } from '../../shared/dialog/agregar-item-dialog/agregar-item-dialog.component';
import { CategoryService } from '../../core/category.service';

@Component({
  selector: 'app-gestion-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './gestion-productos.component.html',
  styleUrls: ['./gestion-productos.component.scss']
})
export class GestionProductosComponent implements OnInit {

  modoEdicion: boolean = false;

  // Señales y variables
  nuevoProducto = signal<{ nombre: string; precio: number; stock: number; codigoBarras: string; descripcion: string, modoEdicion: boolean }>({ nombre: '', precio: 0, stock: 0, codigoBarras: '', descripcion: '', modoEdicion: false });
  productos = signal<Producto[]>([]);
  filtro = signal<string>('');
  categories = signal<Category[]>([]);
  newCategoryName = signal<string>('');
  selectedCategory = signal<string | null>(null);

  productosFiltrados = computed(() =>
    this.productos().filter(p => (p.nombre || '').toLowerCase().includes(this.filtro().toLowerCase()))
  );

  private dialog = inject(MatDialog);
  private categoryService = inject(CategoryService);
  private apiService = inject(ApiService);

  ngOnInit() {
    this.loadProductos();
    this.loadCategories();  // Descomenté esta línea para cargar las categorías
  }

  // Abrir el diálogo para agregar productos
  openDialog(): void {
    const dialogRef = this.dialog.open(AgregarItemDialogComponent, { width: '500px' });
    dialogRef.afterClosed().subscribe((result: Producto | undefined) => {
      if (result) {
        console.log('Producto recibido desde el diálogo:', result);
        this.apiService.agregarProducto(result).subscribe({
          next: (productoAgregado) => {
            console.log('Producto agregado:', productoAgregado);
            this.productos.update(p => [...p, { ...productoAgregado, id: String(productoAgregado.id) }]);
          },
          error: (err) => console.error('Error al agregar el producto:', err)
        });
      }
    });
  }

  // Agregar producto manualmente
  agregarProducto() {
    const producto = this.nuevoProducto();
    // Creamos el producto sin el `id`
    const nuevoProductoSinId: Omit<Producto, 'id'> = {
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      codigoBarras: producto.codigoBarras,
      descripcion: producto.descripcion,
      modoEdicion: producto.modoEdicion,
      precioCompra: producto.precio,
      precioVenta: producto.precio * 1.2,
      categoria: 'Sin categoría', // Categoría predeterminada
    };

    // Llamar al servicio para agregar el producto
    this.apiService.agregarProducto(nuevoProductoSinId).subscribe({
      next: (productoAgregado) => {
        console.log('Producto agregado:', productoAgregado);
        // Al recibir el producto desde el backend, asignamos el `id` correctamente
        this.productos.update(p => [...p, productoAgregado]);
      },
      error: (err) => {
        console.error('Error al agregar el producto:', err);
      }
    });

    // Limpiar la señal de nuevo producto
    this.nuevoProducto.set({ nombre: '', precio: 0, stock: 0, codigoBarras: '', descripcion: '', modoEdicion: false });
  }

  // Cargar productos desde el servicio
  loadProductos() {
    this.apiService.getProductos().subscribe({
      next: (productos) => {
        const productosValidos = productos.map(p => ({
          id: p.id || crypto.randomUUID(), // Si no tiene ID, genera uno temporal
          nombre: p.nombre || 'Sin nombre',
          precio: p.precio || 0,
          stock: p.stock || 0,
          codigoBarras: p.codigoBarras || '',
          descripcion: p.descripcion || '',
          modoEdicion: false, 
          precioCompra: p.precio || 0,
          precioVenta: p.precio ? p.precio * 1.2 : 0,
          categoria: p.categoria || 'Sin categoría'
        }));
        this.productos.set(productosValidos);
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
      }
    });
  }

  // Cargar categorías
  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        if (response.error) {
          console.error('Error al obtener categorías:', response.error);
        } else {
          this.categories.set(response.data);
        }
      },
      error: (error) => {
        console.error('Error en la carga de categorías:', error);
      }
    });
  }

  // Activar modo edición
  editarProducto(producto: Producto) {
    producto.modoEdicion = true;
  }

  // Guardar producto editado
  guardarProducto(producto: Producto) {
    this.apiService.editarProducto(producto.id, producto).then(updatedProducto => {
      if (updatedProducto) {
        producto.modoEdicion = false;
        this.productos.update(p => p.map(pItem => pItem.id === producto.id ? updatedProducto : pItem));
      } else {
        console.warn('⚠️ No se pudo actualizar el producto.');
      }
    }).catch(err => console.error('❌ Error al editar producto:', err));
  }

  // Eliminar producto
  eliminarProducto(id: string) {
    console.log('🛑 ID recibido en eliminarProducto:', id);

    if (!id) {
      console.error('🚨 El ID del producto no está definido.');
      return;
    }

    this.apiService.eliminarProducto(id).subscribe({
      next: () => {
        console.log('✅ Producto eliminado correctamente.');
        this.productos.update(p => p.filter(producto => producto.id !== id));
      },
      error: (err) => console.error('❌ Error al eliminar el producto:', err)
    });
  }
}
