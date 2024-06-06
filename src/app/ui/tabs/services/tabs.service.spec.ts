import { TestBed } from '@angular/core/testing';
import { TabsService } from './tabs.service';

describe('TabsService', (): void => {
  let service: TabsService;

  beforeEach((): void => {
    TestBed.configureTestingModule({
      providers: [TabsService],
    });

    service = TestBed.inject(TabsService);
  });

  it('should be created', (): void => {
    expect(service).toBeTruthy();
  });
});
