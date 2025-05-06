
import { Producto } from 'shared/model/producto.model';

export class Venta {
  private productos: Producto[];
  private cliente: string;
  private descuento: number = 0;

  constructor(cliente: string, productos: Producto[] = []) {
    this.cliente = cliente;
    this.productos = productos;
  }

  agregarProducto(producto: Producto): void {
    const productoExistente = this.productos.find(p => p.productoId === producto.productoId);
    if (productoExistente) {
      productoExistente.cantidad += producto.cantidad;
    } else {
      this.productos.push(producto);
    }
  }

  aplicarDescuento(descuento: number): void {
    this.descuento = descuento;
  }

  total(): number {
    const total = this.productos.reduce((total, producto) => total + producto.precioVenta * producto.cantidad, 0);
    return total - (total * this.descuento);  // Aplicar descuento
  }

  obtenerDetalles(): any {
    return {
      cliente: this.cliente,
      productos: this.productos,
      total: this.total(),
    };
  }
}
