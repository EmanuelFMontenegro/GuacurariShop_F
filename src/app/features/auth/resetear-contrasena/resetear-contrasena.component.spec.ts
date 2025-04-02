import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetearContrasenaComponent } from './resetear-contrasena.component';

describe('ResetearContrasenaComponent', () => {
  let component: ResetearContrasenaComponent;
  let fixture: ComponentFixture<ResetearContrasenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetearContrasenaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetearContrasenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
