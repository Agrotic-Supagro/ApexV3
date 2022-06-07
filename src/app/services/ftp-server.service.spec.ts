import { TestBed } from '@angular/core/testing';

import { FtpServerService } from './ftp-server.service';

describe('FtpServerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FtpServerService = TestBed.get(FtpServerService);
    expect(service).toBeTruthy();
  });
});
