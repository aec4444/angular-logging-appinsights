import { TestBed } from '@angular/core/testing';

import { AngularLoggingAppinsightsService } from './angular-logging-appinsights.service';

describe('AngularLoggingAppinsightsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AngularLoggingAppinsightsService = TestBed.get(AngularLoggingAppinsightsService);
    expect(service).toBeTruthy();
  });
});
