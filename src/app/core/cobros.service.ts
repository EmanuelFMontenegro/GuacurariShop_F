import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cobro } from '../shared/models/Cobro.model';

@Injectable({
  providedIn: 'root'
})
export class CobrosService {
  private cobros: Cobro[] = [];
  private cobrosSubject = new BehaviorSubject<Cobro[]>(this.cobros);

  getCobros() {
    return this.cobrosSubject.asObservable();
  }

 
  registrarCobro(cobro: Cobro) {
    this.cobros.push(cobro);
    this.cobrosSubject.next(this.cobros);
  }
}
