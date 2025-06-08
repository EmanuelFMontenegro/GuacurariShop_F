import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoBase } from '@shared/models/ProductoBase.model';
import { ToastrService } from 'ngx-toastr';
import { VentasFacade } from '../aplications/ventas.facade';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {
  nombreProducto: string = '';
  productos$: Observable<ProductoBase[]> = of([]);  // Inicializado como Observable vacío
  totalVenta: number = 0;
  carrito: ProductoBase[] = [];  // Definido carrito para la plantilla
  selectedProduct: ProductoBase | null = null;
  
  

  constructor(
    public ventasFacade: VentasFacade,
    private toast: ToastrService
  ) {
    // Asegúrate de que getProductos() retorna un Observable
    this.productos$ = this.ventasFacade.getProductos();
  }

  ngOnInit() {
  // Suscribite al carrito para mostrarlo y calcular el total
  this.ventasFacade.carrito$.subscribe(carrito => {
    this.carrito = carrito;
    this.actualizarTotal();
  });  
  }
  
  onBarcodeInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value.length >= 13) {
      this.buscarPorCodigoBarras(input.value);
      input.value = '';
    }
  }

  private buscarPorCodigoBarras(codigo: string) {
    // Ahora no es necesario subscribirse manualmente. Se usa el async pipe
    this.productos$.subscribe(productos => {
      const productoEncontrado = productos.find(p => p.productoId === codigo);
      if (productoEncontrado) {
        this.agregarAlCarrito(productoEncontrado);
      } else {
        this.toast.warning('Producto no encontrado', 'Aviso');
      }
    });
  }

  agregarAlCarrito(producto: ProductoBase) {
    this.carrito.push(producto);
    this.ventasFacade.agregarProductoACarrito(producto);
    this.actualizarTotal();
  }

  actualizarSubtotal(item: ProductoBase): number {
    return item.precioVenta * (item.cantidad || 1);
  }

  actualizarCantidad(item: ProductoBase) {
    this.ventasFacade.actualizarCantidadProducto(item);
    this.actualizarTotal();
  }

  removeItem(producto: ProductoBase): void {
    this.ventasFacade.eliminarProductoDelCarrito(producto);
    this.actualizarTotal();
  }

  realizarVenta(): void {
    // Verificar si hay productos en el carrito
    const totalVenta = this.ventasFacade.obtenerTotalVenta();
  
    if (totalVenta > 0) {
      this.ventasFacade.realizarVenta().subscribe({
        next: (respuesta: { total: number }) => {
          this.toast.success(`Venta realizada. Total: $${respuesta.total}`, 'Éxito');
          this.actualizarTotal();
        },
        error: (error: Error) => {
          this.toast.error(`Error al procesar la venta: ${error.message}`, 'Error');
        }
      });
    } else {
      this.toast.warning('No hay productos en el carrito', 'Aviso');
    }
  }
   buscarProductoPorNombre(nombre: string): void {
    // Implement your search logic here
    // For example, filter your products list based on the name
    // This is a placeholder implementation
    console.log('Buscando producto por nombre:', nombre);
  }
  private actualizarTotal() {
    this.totalVenta = this.ventasFacade.obtenerTotalVenta();
  }
}
