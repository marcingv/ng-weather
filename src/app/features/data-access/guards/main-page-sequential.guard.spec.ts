import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  provideRouter,
  RedirectCommand,
  RouterStateSnapshot,
} from '@angular/router';
import { mainPageSequentialGuard } from './main-page-sequential.guard';
import {
  LocationService,
  WeatherService,
} from '@features/data-access/services';
import { ZipcodeAndCity } from '@features/data-access/types';
import { ZipCode } from '@core/types';
import { PathParams } from '@core/router/path-params';
import { firstValueFrom, Observable, of } from 'rxjs';
import { CurrentConditionsFactory } from '@testing/factories';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('mainPageSequentialGuard', (): void => {
  let guard: CanActivateFn;

  let locationsSpy: SpyObj<LocationService>;
  let weatherServiceSpy: SpyObj<WeatherService>;

  let routeSpy: SpyObj<ActivatedRouteSnapshot>;
  let stateSpy: SpyObj<RouterStateSnapshot>;

  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  const KNOWN_LOCATIONS: ZipcodeAndCity[] = [
    { zipcode: '10001', city: 'New York' },
    { zipcode: '95742', city: 'Rancho Cordova' },
  ];

  const UNKNOWN_LOCATIONS_ZIPCODES: ZipCode[] = ['10000', '20000'];

  beforeEach((): void => {
    routeSpy = createSpyObj<ActivatedRouteSnapshot>(['params']);
    stateSpy = createSpyObj<RouterStateSnapshot>(['url']);

    route = routeSpy as ActivatedRouteSnapshot;
    state = stateSpy as RouterStateSnapshot;

    locationsSpy = createSpyObj<LocationService>([
      'userLocations',
      'findLocationByZipcode',
    ]);
    locationsSpy.userLocations.and.returnValue(KNOWN_LOCATIONS);
    locationsSpy.findLocationByZipcode.and.callFake(
      (zipcode: ZipCode): ZipcodeAndCity | undefined => {
        return KNOWN_LOCATIONS.find(
          oneLocation => oneLocation.zipcode === zipcode
        );
      }
    );

    weatherServiceSpy = createSpyObj<WeatherService>(['loadCurrentConditions']);
    weatherServiceSpy.loadCurrentConditions.and.callFake((zipcode: ZipCode) => {
      return of({
        zip: zipcode,
        data: CurrentConditionsFactory.createInstance(),
        isLoading: false,
        isLoadError: false,
        errorMessage: undefined,
        fetchTimestamp: Date.now(),
      });
    });

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: LocationService, useValue: locationsSpy },
        { provide: WeatherService, useValue: weatherServiceSpy },
      ],
    });

    guard = (...guardParameters) =>
      TestBed.runInInjectionContext(() =>
        mainPageSequentialGuard({
          preloadingStrategy: 'on-demand-data-fetching',
        })(...guardParameters)
      );
  });

  it('should be created', (): void => {
    expect(guard).toBeTruthy();
  });

  describe('When use has locations', (): void => {
    it('should allow access and preload data when zipcode in url is known', async () => {
      routeSpy.params = { [PathParams.ZIPCODE]: KNOWN_LOCATIONS[1].zipcode };

      const guardResult = guard(route, state);

      expect(guardResult).toBeTruthy();
      expect(guardResult).toBeInstanceOf(Observable);

      const preloadingResult: boolean = await firstValueFrom(
        guardResult as Observable<boolean>
      );

      expect(preloadingResult).toBeTrue();
      expect(weatherServiceSpy.loadCurrentConditions).toHaveBeenCalled();
    });

    it('should deny access and redirect when zipcode is not known location', () => {
      routeSpy.params = { [PathParams.ZIPCODE]: UNKNOWN_LOCATIONS_ZIPCODES[0] };

      const guardResult = guard(route, state);

      expect(guardResult).toBeTruthy();
      expect(guardResult).toBeInstanceOf(RedirectCommand);
      expect((guardResult as RedirectCommand).redirectTo.toString()).toEqual(
        `/${KNOWN_LOCATIONS[0].zipcode}`
      );
      expect(weatherServiceSpy.loadCurrentConditions).not.toHaveBeenCalled();
    });
  });

  describe("When user doesn't have any locations", (): void => {
    beforeEach(() => {
      locationsSpy.userLocations.and.returnValue([]);
      locationsSpy.findLocationByZipcode.and.callFake(
        (): ZipcodeAndCity | undefined => {
          return undefined;
        }
      );
    });

    it('should allow access if there is no zipcode in the url', (): void => {
      routeSpy.params = {};

      const guardResult = guard(route, state);

      expect(guardResult).toBeTruthy();
      expect(guardResult).not.toBeInstanceOf(RedirectCommand);
      expect(weatherServiceSpy.loadCurrentConditions).not.toHaveBeenCalled();
    });

    it('should redirect to root url when there is unknown zipcode in the url', (): void => {
      routeSpy.params = { [PathParams.ZIPCODE]: UNKNOWN_LOCATIONS_ZIPCODES[0] };

      const guardResult = guard(route, state);

      expect(guardResult).toBeTruthy();
      expect(guardResult).toBeInstanceOf(RedirectCommand);
      expect(weatherServiceSpy.loadCurrentConditions).not.toHaveBeenCalled();
    });
  });
});
