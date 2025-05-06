import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VentasComponent } from './ventas.component';
import { VentasFacade } from '../aplications/ventas.facade';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';

// Mock de ProductoBase
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

// Mock de VentasFacade
class MockVentasFacade {
  private carrito: ProductoBase[] = [];
  
  getProductos() {
    return of([{
      productoId: '1',
      nombre: 'Producto 1',
      precioCompra: 100,
      precioVenta: 150,
      stock: 10,
      categoria: 'Categoria 1',
      modoEdicion: false,
      cantidad: 1
    }]);
  }

  agregarProductoACarrito(producto: ProductoBase) {
    this.carrito.push(producto);
  }

  obtenerTotalVenta() {
    return this.carrito.reduce((total, item) => total + (item.precioVenta * (item.cantidad || 1)), 0);
  }

  realizarVenta() {
    const total = this.obtenerTotalVenta();
    this.carrito = [];
    return of({ total });
  }

  eliminarProductoDelCarrito(producto: ProductoBase) {
    this.carrito = this.carrito.filter(p => p.productoId !== producto.productoId);
  }
}

describe('VentasComponent', () => {
  let component: VentasComponent;
  let fixture: ComponentFixture<VentasComponent>;
  let ventasFacade: MockVentasFacade;
  let toastrService: ToastrService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VentasComponent],
      providers: [
        { provide: VentasFacade, useClass: MockVentasFacade },
        { 
          provide: ToastrService, 
          useValue: { 
            success: jasmine.createSpy('success'), 
            warning: jasmine.createSpy('warning') 
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VentasComponent);
    component = fixture.componentInstance;
    ventasFacade = TestBed.inject(VentasFacade);
    toastrService = TestBed.inject(ToastrService);

    // Mock de métodos del componente
    component.selectedProduct = null;
    component.onBarcodeInput = jasmine.createSpy('onBarcodeInput');
    component.actualizarSubtotal = jasmine.createSpy('actualizarSubtotal').and.callFake((item: ProductoBase) => {
      return item.precioVenta * (item.cantidad || 1);
    });

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load productos on init', () => {
    component.ngOnInit();
    expect(component.productos.length).toBe(1);
    expect(component.productos[0].nombre).toBe('Producto 1');
  });

  it('should add product to carrito and calculate total', () => {
    const producto: ProductoBase = {
      productoId: '1',
      nombre: 'Producto Test',
      precioCompra: 50,
      precioVenta: 100,
      stock: 5,
      categoria: 'Test'
    };
    
    component.agregarAlCarrito(producto);
    expect(ventasFacade.obtenerTotalVenta()).toBe(100);
  });

  it('should show success toast when a sale is completed', () => {
    component.realizarVenta();
    expect(toastrService.success).toHaveBeenCalledWith('Venta realizada. Total: $0', 'Éxito');
  });

  it('should show warning toast when there are no products in the carrito', () => {
    (ventasFacade as any).carrito = [];
    component.realizarVenta();
    expect(toastrService.warning).toHaveBeenCalledWith('No hay productos en el carrito', 'Aviso');
  });
});