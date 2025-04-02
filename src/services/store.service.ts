import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Store } from '../app/shared/models/Store.model';

@Injectable({
  providedIn: 'root',
})
export class StoreService {

  private storeSubject = new BehaviorSubject<Store | null>(null);
  store$ = this.storeSubject.asObservable();

  setStoreData(data: Store | null): void {
    this.storeSubject.next(data);
  }

  getStoreData(): Store | null {
    return this.storeSubject.getValue();
  }
}
