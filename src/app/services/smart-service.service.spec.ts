import { TestBed } from '@angular/core/testing';

import { SmartServiceService } from './smart-service.service';

describe('SmartServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SmartServiceService = TestBed.get(SmartServiceService);
    expect(service).toBeTruthy();
  });
});
