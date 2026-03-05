import { TestBed } from '@angular/core/testing';

import { ObrigatoriosService } from './obrigatorios.service';

describe('ObrigatoriosService', () => {
  let service: ObrigatoriosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObrigatoriosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
