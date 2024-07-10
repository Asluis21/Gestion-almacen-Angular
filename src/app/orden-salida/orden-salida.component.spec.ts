import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenSalidaComponent } from './orden-salida.component';

describe('OrdenSalidaComponent', () => {
  let component: OrdenSalidaComponent;
  let fixture: ComponentFixture<OrdenSalidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenSalidaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrdenSalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
