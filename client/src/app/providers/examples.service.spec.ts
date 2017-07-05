import { TestBed, inject } from '@angular/core/testing';

import { ExamplesService } from './examples.service';

describe('ExamplesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExamplesService]
    });
  });

  it('should be created', inject([ExamplesService], (service: ExamplesService) => {
    expect(service).toBeTruthy();
  }));
});
