import { TestBed } from '@angular/core/testing';

import { LatestPictureService } from './latest-picture.service';

describe('LatestPictureService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LatestPictureService = TestBed.get(LatestPictureService);
    expect(service).toBeTruthy();
  });
});
