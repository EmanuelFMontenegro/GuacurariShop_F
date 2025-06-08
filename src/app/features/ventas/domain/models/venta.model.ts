import { Producto } from '@shared/models/ProductoBase.model'; // Importamos Producto para usarlo en Venta

interface VentaDetalles {
  cliente: string;
  productos: Producto[];
  total: number;
}

export class Venta {
  private productos: Producto[];  
  private cliente: string;         
  private descuento: number = 0;   

  constructor(cliente: string, productos: Producto[] = []) {
    this.cliente = cliente;
    this.productos = productos;
  }

  // Método para obtener los productos
  getProductos(): Producto[] {
    return this.productos;
  }

  agregarProducto(producto: Producto): void {
    const productoExistente = this.productos.find(p => p.productoId === producto.productoId);
    if (productoExistente) {
      productoExistente.cantidad! += producto.cantidad!; 
    } else {
      this.productos.push(producto);
    }
  }

  // Aplicar un descuento a la venta
  aplicarDescuento(descuento: number): void {
    this.descuento = descuento;
  }

  // Calcular el total de la venta con los productos y el descuento aplicado
  total(): number {
    const total = this.productos.reduce((total, producto) => 
      total + (producto.precioVenta * (producto.cantidad || 1)), 0
    );
    return total - (total * this.descuento); // Aplicar descuento
  }

  // Obtener los detalles de la venta (cliente, productos y total)
  obtenerDetalles(): VentaDetalles {
    return {
      cliente: this.cliente,
      productos: this.productos,
      total: this.total(),  // Calcular el total usando la lógica definida
    };
  }

  // Eliminar un producto del carrito
  eliminarProductoDelCarrito(producto: Producto): void {
    this.productos = this.productos.filter(p => p.productoId !== producto.productoId);
  }

  // Actualizar la cantidad de un producto
  actualizarCantidadProducto(producto: Producto): void {
    const index = this.productos.findIndex(p => p.productoId === producto.productoId);
    if (index !== -1) {
      this.productos[index].cantidad = producto.cantidad;
    }
  }
}
