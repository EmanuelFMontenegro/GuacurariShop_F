
import { Producto } from "./Producto.model"; 

export interface Factura {
  id: string;
  productos: Producto[];  
  total: number;
  fecha: Date;
}
