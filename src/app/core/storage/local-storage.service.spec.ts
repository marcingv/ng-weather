import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', (): void => {
  let service: LocalStorageService;
  const KEY = 'test';

  beforeEach((): void => {
    TestBed.configureTestingModule({});

    service = TestBed.inject(LocalStorageService);
    service.clearItem(KEY);
  });

  it('should be created', (): void => {
    expect(service).toBeTruthy();
  });

  it('should initially have empty value for specified key', (): void => {
    expect(service.hasItem(KEY)).toBeFalse();
    expect(service.getItem(KEY)).toBeNull();
  });

  it('should return values from storage', () => {
    const dataObj1 = { name: 'Test object' };
    const dataObj2 = { name: 'Updated test object' };

    expect(service.hasItem(KEY)).toBeFalse();

    service.setItem(KEY, dataObj1);
    expect(service.getItem(KEY)).toEqual(dataObj1);

    service.setItem(KEY, dataObj2);
    expect(service.getItem(KEY)).toEqual(dataObj2);
  });

  it('should clear value', () => {
    expect(service.hasItem(KEY)).toBeFalse();
    expect(service.getItem(KEY)).toBeNull();

    service.setItem(KEY, 'test value');

    expect(service.hasItem(KEY)).toBeTrue();
    expect(service.getItem(KEY)).toBeTruthy();

    service.clearItem(KEY);

    expect(service.hasItem(KEY)).toBeFalse();
    expect(service.getItem(KEY)).toBeNull();
  });
});
