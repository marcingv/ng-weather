import { TestBed } from '@angular/core/testing';
import { LocationService } from './location.service';
import { BrowserStorage, LocalStorageService } from '@core/storage';
import { InMemoryStorageService } from '@testing/storage';
import { ZipcodeAndCity } from '@features/data-access/types';

describe('LocationService', (): void => {
  let service: LocationService;
  let storageService: InMemoryStorageService;

  beforeEach((): void => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LocalStorageService, useClass: InMemoryStorageService },
      ],
    });

    const storage: BrowserStorage = TestBed.inject(LocalStorageService);
    storageService = storage as InMemoryStorageService;
    service = TestBed.inject(LocationService);

    TestBed.flushEffects();
  });

  it('should be created', (): void => {
    expect(service).toBeTruthy();
  });

  it('should initially have empty user locations', (): void => {
    expect(service.userLocations().length).toEqual(0);
  });

  it('should add location', (): void => {
    expect(service.userLocations().length).toEqual(0);

    service.addLocation({ zipcode: '10001', city: 'New York' });

    expect(service.userLocations().length).toEqual(1);
  });

  it('should not allow for duplicated locations', (): void => {
    expect(service.userLocations().length).toEqual(0);

    service.addLocation({ zipcode: '10001', city: 'New York' });
    service.addLocation({ zipcode: '10001', city: 'New York' });

    expect(service.userLocations().length).toEqual(1);
  });

  it('should remove location', (): void => {
    service.addLocation({ zipcode: '10001', city: 'New York' });

    expect(service.userLocations().length).toEqual(1);

    service.removeLocation('10001');

    expect(service.userLocations().length).toEqual(0);
  });

  it('should not find location which was not added', (): void => {
    expect(service.findLocationByZipcode('10002')).toBeUndefined();
  });

  it('should find user location', (): void => {
    expect(service.findLocationByZipcode('10001')).toBeUndefined();

    service.addLocation({ zipcode: '10001', city: 'New York' });

    expect(service.findLocationByZipcode('10001')).not.toBeUndefined();
  });

  it('should synchronize data between tabs', (): void => {
    expect(service.userLocations().length).toEqual(0);

    const remoteLocations: ZipcodeAndCity[] = [
      { zipcode: '30003', city: 'City 1' },
      { zipcode: '40004', city: 'City 2' },
    ];

    storageService.remoteDataChange$.next({
      key: 'locations',
      value: remoteLocations,
    });

    expect(service.userLocations().length).toEqual(remoteLocations.length);
    expect(service.userLocations()).toContain(remoteLocations[0]);
    expect(service.userLocations()).toContain(remoteLocations[1]);
  });
});
