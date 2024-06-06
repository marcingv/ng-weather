import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { mainPageSequentialGuard } from './main-page-sequential.guard';

describe('mainPageSequentialGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() =>
      mainPageSequentialGuard({
        preloadingStrategy: 'on-demand-data-fetching',
      })(...guardParameters)
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
