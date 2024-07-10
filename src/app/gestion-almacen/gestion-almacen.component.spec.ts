import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAlmacenComponent } from './gestion-almacen.component';

describe('GestionAlmacenComponent', () => {
  let component: GestionAlmacenComponent;
  let fixture: ComponentFixture<GestionAlmacenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionAlmacenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionAlmacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
