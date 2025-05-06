import { ProductoBase } from './ProductoBase.model';

export interface Venta {
  total: number;
  productos: ProductoBase[];
  fecha?: Date;
}