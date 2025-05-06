
import { Producto } from "./ProductoBase.model"; 

export interface Factura {
  id: string;
  productos: Producto[];  
  total: number;
  fecha: Date;
}
