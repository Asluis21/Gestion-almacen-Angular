import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroOrdenesComponent } from './registro-ordenes.component';

describe('RegistroOrdenesComponent', () => {
  let component: RegistroOrdenesComponent;
  let fixture: ComponentFixture<RegistroOrdenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroOrdenesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistroOrdenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
