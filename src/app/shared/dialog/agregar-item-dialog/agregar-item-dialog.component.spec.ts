import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarItemDialogComponent } from './agregar-item-dialog.component';

describe('AgregarItemDialogComponent', () => {
  let component: AgregarItemDialogComponent;
  let fixture: ComponentFixture<AgregarItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarItemDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
