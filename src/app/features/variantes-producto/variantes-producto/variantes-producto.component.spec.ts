import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantesProductoComponent } from './variantes-producto.component';

describe('VariantesProductoComponent', () => {
  let component: VariantesProductoComponent;
  let fixture: ComponentFixture<VariantesProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariantesProductoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariantesProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
