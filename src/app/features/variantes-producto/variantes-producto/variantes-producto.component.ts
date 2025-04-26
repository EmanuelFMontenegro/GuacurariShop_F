import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { VarianteProducto } from '../../../shared/models/variante-producto.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-variantes-producto',
  standalone: true, 
  templateUrl: './variantes-producto.component.html',
  styleUrls: ['./variantes-producto.component.scss'],
  imports: [CommonModule] 
})
export class VariantesProductoComponent implements OnInit {
  private variantesSubject = new BehaviorSubject<VarianteProducto[]>([]); 
  variantes$: Observable<VarianteProducto[]> = this.variantesSubject.asObservable();

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarVariantes();
  }

  cargarVariantes() {
    this.apiService.getVariantesPorProducto('PRODUCTO_ID_AQUI').subscribe({
      next: (data) => {
        this.variantesSubject.next(data);
      },
      error: (error) => {
        console.error('Error al cargar variantes:', error);
        this.variantesSubject.next([]);
      }
    });
  }
}
