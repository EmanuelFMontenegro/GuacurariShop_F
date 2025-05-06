

export interface ProductoBase {
  productoId: string;
  nombre: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  categoria: string;
  modoEdicion?: boolean;
  cantidad?: number;
}

// Producto para mostrar en la vista del catálogo o carrito (con cantidades)
export interface Producto extends ProductoBase {
  cantidad?: number;  // Solo en Producto
}

// Producto para facturación (sin cantidad, solo datos relevantes para la factura)
export interface ProductoFactura extends ProductoBase {
  precio: number;  // Este campo parece redundante, ya que ya lo tenemos en la base, pero lo dejamos por compatibilidad
}
