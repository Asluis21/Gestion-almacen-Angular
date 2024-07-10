import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresarOrdenComponent } from './ingresar-orden.component';

describe('IngresarOrdenComponent', () => {
  let component: IngresarOrdenComponent;
  let fixture: ComponentFixture<IngresarOrdenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresarOrdenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IngresarOrdenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
