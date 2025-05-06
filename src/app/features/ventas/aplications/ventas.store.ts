import { signal } from '@angular/core';

export class VentasStore {
  // Estado reactivo con signals
  private _ventas = signal([]);
  ventas = this._ventas.asObservable();

  setVentas(newVentas: any[]) {
    this._ventas.set(newVentas);
  }
}