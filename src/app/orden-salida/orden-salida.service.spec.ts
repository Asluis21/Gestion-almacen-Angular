import { TestBed } from '@angular/core/testing';

import { OrdenSalidaService } from './orden-salida.service';

describe('OrdenSalidaService', () => {
  let service: OrdenSalidaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdenSalidaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
