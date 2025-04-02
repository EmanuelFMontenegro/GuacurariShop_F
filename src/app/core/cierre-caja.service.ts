import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CierreCajaService {
  private cierreCaja = {
    fecha: new Date(),
    ventas: 0,
    cobros: 0,
    saldo: 0
  };
  private cierreCajaSubject = new BehaviorSubject(this.cierreCaja);

  
  getCierreCaja() {
    return this.cierreCajaSubject.asObservable();
  }

  
  registrarVenta(monto: number) {
    this.cierreCaja.ventas += monto;
    this.actualizarSaldo();
  }

 
  registrarCobro(monto: number) {
    this.cierreCaja.cobros += monto;
    this.actualizarSaldo();
  }

 
  private actualizarSaldo() {
    this.cierreCaja.saldo = this.cierreCaja.cobros - this.cierreCaja.ventas;
    this.cierreCajaSubject.next(this.cierreCaja);
  }

 
  finalizarCierre() {
    
    console.log('Cierre de caja finalizado', this.cierreCaja);
  }
}
