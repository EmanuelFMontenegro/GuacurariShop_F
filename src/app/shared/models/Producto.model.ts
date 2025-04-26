export interface Producto {
  productoId: string; 
  nombre: string;
  descripcion?: string;
  precio?: number;  
  precioCompra: number;
  precioVenta: number;
  stock: number;
  categoria: string;
  cantidad?: number;
  codigoBarras?: string;
  modoEdicion: boolean;
}


export interface ProductoFactura {
  productoId: string; 
  nombre: string;
  precio: number;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  categoria: string;
  modoEdicion: boolean;
}

