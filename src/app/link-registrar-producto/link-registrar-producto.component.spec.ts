import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkRegistrarProductoComponent } from './link-registrar-producto.component';

describe('LinkRegistrarProductoComponent', () => {
  let component: LinkRegistrarProductoComponent;
  let fixture: ComponentFixture<LinkRegistrarProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkRegistrarProductoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LinkRegistrarProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
