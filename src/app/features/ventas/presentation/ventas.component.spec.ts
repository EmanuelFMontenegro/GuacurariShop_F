import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VentasComponent } from './ventas.component';
import { VentasFacade } from '../aplications/ventas.facade';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ProductoBase {
  productoId: string;
  nombre: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  categoria: string;
  modoEdicion?: boolean;
  cantidad?: number;
}

class MockVentasFacade {
  private _carrito = new BehaviorSubject<ProductoBase[]>([]);
  carrito$ = this._carrito.asObservable();

  private productos: ProductoBase[] = [
    {
      productoId: '1',
      nombre: 'Producto 1',
      precioCompra: 100,
      precioVenta: 150,
      stock: 10,
      categoria: 'Categoria 1',
      cantidad: 1
    }
  ];

  getProductos(): Observable<ProductoBase[]> {
    return of(this.productos);
  }

  agregarProductoACarrito(producto: ProductoBase) {
    const current = this._carrito.getValue();
    this._carrito.next([...current, producto]);
  }

  obtenerTotalVenta(): number {
    return this._carrito.getValue().reduce((total, item) => total + (item.precioVenta * (item.cantidad || 1)), 0);
  }

  realizarVenta() {
    const total = this.obtenerTotalVenta();
    this._carrito.next([]);
    return of({ total });
  }

  eliminarProductoDelCarrito(producto: ProductoBase) {
    const updated = this._carrito.getValue().filter(p => p.productoId !== producto.productoId);
    this._carrito.next(updated);
  }

  actualizarCantidadProducto(_: ProductoBase) {}
}

describe('VentasComponent', () => {
  let component: VentasComponent;
  let fixture: ComponentFixture<VentasComponent>;
  let ventasFacade: MockVentasFacade;
  let toastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'warning', 'error']);

    await TestBed.configureTestingModule({
      imports: [VentasComponent, CommonModule, FormsModule],
      providers: [
        { provide: VentasFacade, useClass: MockVentasFacade },
        { provide: ToastrService, useValue: toastrSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VentasComponent);
    component = fixture.componentInstance;
    ventasFacade = TestBed.inject(VentasFacade) as any;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load productos on init and update carrito', () => {
    component.ngOnInit();
    ventasFacade.agregarProductoACarrito({
      productoId: '2',
      nombre: 'Producto Test',
      precioCompra: 20,
      precioVenta: 40,
      stock: 10,
      categoria: 'Test',
      cantidad: 1
    });
    expect(component.carrito.length).toBe(1);
  });

  it('should add product to carrito and calculate total', () => {
    const producto: ProductoBase = {
      productoId: '3',
      nombre: 'Producto Nuevo',
      precioCompra: 10,
      precioVenta: 25,
      stock: 2,
      categoria: 'X',
      cantidad: 2
    };
    component.agregarAlCarrito(producto);
    const total = ventasFacade.obtenerTotalVenta();
    expect(total).toBe(50);
  });

  it('should show success toast when a sale is completed', () => {
    const producto: ProductoBase = {
      productoId: '4',
      nombre: 'Vendible',
      precioCompra: 10,
      precioVenta: 30,
      stock: 5,
      categoria: 'Y',
      cantidad: 2
    };
    component.agregarAlCarrito(producto);
    component.realizarVenta();
    expect(toastrService.success).toHaveBeenCalledWith('Venta realizada. Total: $60', 'Éxito');
  });

  it('should show warning toast when carrito is empty', () => {
    component.realizarVenta();
    expect(toastrService.warning).toHaveBeenCalledWith('No hay productos en el carrito', 'Aviso');
  });
});
