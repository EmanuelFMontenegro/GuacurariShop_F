export interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio?: number;  
  precioCompra: number;
  precioVenta: number;
  stock: number;
  categoria: string;
  cantidad?: number;
  codigoBarras?: string;
  modoEdicion:boolean;
}


export interface ProductoFactura {
  id: string;
  nombre: string;
  precio: number;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  categoria: string;
  modoEdicion: boolean;
}
