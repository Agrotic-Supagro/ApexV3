import { TestBed } from '@angular/core/testing';

import { UserConfigurationService } from './user-configuration.service';

describe('UserConfigurationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserConfigurationService = TestBed.get(UserConfigurationService);
    expect(service).toBeTruthy();
  });
});
