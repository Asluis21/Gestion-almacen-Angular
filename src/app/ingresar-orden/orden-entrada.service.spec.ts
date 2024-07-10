import { TestBed } from '@angular/core/testing';

import { OrdenEntradaService } from './orden-entrada.service';

describe('OrdenEntradaService', () => {
  let service: OrdenEntradaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdenEntradaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
