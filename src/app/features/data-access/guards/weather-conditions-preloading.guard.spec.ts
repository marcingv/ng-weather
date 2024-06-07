import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  provideRouter,
  RouterStateSnapshot,
} from '@angular/router';
import { weatherConditionsPreloadingGuard } from './weather-conditions-preloading.guard';
import {
  LocationService,
  WeatherService,
} from '@features/data-access/services';
import { ZipcodeAndCity } from '@features/data-access/types';
import { ZipCode } from '@core/types';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { CurrentConditionsFactory } from '@testing/factories';
import { HttpErrorResponse } from '@angular/common/http';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { PathParams } from '@core/router/path-params';

describe('weatherConditionsPreloadingGuard', (): void => {
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
        zipcode: zipcode,
        data: CurrentConditionsFactory.createInstance(),
        isLoading: false,
        isLoadError: false,
        errorMessage: undefined,
        fetchTimestamp: Date.now(),
      });
    });
  });

  describe('Eager data fetching guard', (): void => {
    let guard: CanActivateFn;

    beforeEach((): void => {
      TestBed.configureTestingModule({
        providers: [
          provideRouter([]),
          { provide: LocationService, useValue: locationsSpy },
          { provide: WeatherService, useValue: weatherServiceSpy },
        ],
      });

      guard = (...guardParameters) =>
        TestBed.runInInjectionContext(() =>
          weatherConditionsPreloadingGuard({
            preloadingStrategy: 'eager-data-fetching',
          })(...guardParameters)
        );
    });

    it('should be created', (): void => {
      expect(guard).toBeTruthy();
    });

    it('should eagerly fetch weather conditions for all user locations', async () => {
      routeSpy.params = {};

      const guardResult: boolean = await firstValueFrom(
        guard(route, state) as Observable<boolean>
      );

      expect(guardResult).toBeTrue();
      expect(weatherServiceSpy.loadCurrentConditions).toHaveBeenCalledTimes(
        KNOWN_LOCATIONS.length
      );
    });

    it('should allow access if eager loading failed', async () => {
      routeSpy.params = {};

      weatherServiceSpy.loadCurrentConditions.and.callFake(() => {
        return throwError(() => {
          return new HttpErrorResponse({ status: 500 });
        });
      });

      const guardResult: boolean = await firstValueFrom(
        guard(route, state) as Observable<boolean>
      );

      expect(guardResult).toBeTrue();
      expect(weatherServiceSpy.loadCurrentConditions).toHaveBeenCalledTimes(
        KNOWN_LOCATIONS.length
      );
    });
  });

  describe('Lazy data fetching guard', (): void => {
    let guard: CanActivateFn;

    beforeEach((): void => {
      TestBed.configureTestingModule({
        providers: [
          provideRouter([]),
          { provide: LocationService, useValue: locationsSpy },
          { provide: WeatherService, useValue: weatherServiceSpy },
        ],
      });

      guard = (...guardParameters) =>
        TestBed.runInInjectionContext(() =>
          weatherConditionsPreloadingGuard({
            preloadingStrategy: 'on-demand-data-fetching',
          })(...guardParameters)
        );
    });

    it('should be created', (): void => {
      expect(guard).toBeTruthy();
    });

    it('should lazily fetch weather conditions for zipcode specified in url', async () => {
      const zipcodeInUrl: ZipCode = KNOWN_LOCATIONS[0].zipcode;
      routeSpy.params = { [PathParams.ZIPCODE]: zipcodeInUrl };

      const guardResult: boolean = await firstValueFrom(
        guard(route, state) as Observable<boolean>
      );

      expect(guardResult).toBeTrue();
      expect(weatherServiceSpy.loadCurrentConditions).toHaveBeenCalledOnceWith(
        zipcodeInUrl
      );
    });

    it('should lazily fetch weather conditions for very fist user location when zipcode in url is unknown', async () => {
      const zipcodeInUrl: ZipCode = UNKNOWN_LOCATIONS_ZIPCODES[0];
      routeSpy.params = { [PathParams.ZIPCODE]: zipcodeInUrl };

      const guardResult: boolean = await firstValueFrom(
        guard(route, state) as Observable<boolean>
      );

      expect(guardResult).toBeTrue();
      expect(weatherServiceSpy.loadCurrentConditions).toHaveBeenCalledOnceWith(
        KNOWN_LOCATIONS[0].zipcode
      );
    });

    it('should lazily fetch weather conditions for very fist user location when there is no zipcode in url', async () => {
      routeSpy.params = {};

      const guardResult: boolean = await firstValueFrom(
        guard(route, state) as Observable<boolean>
      );

      expect(guardResult).toBeTrue();
      expect(weatherServiceSpy.loadCurrentConditions).toHaveBeenCalledOnceWith(
        KNOWN_LOCATIONS[0].zipcode
      );
    });

    it('should not fetch anything and allow access if user has no locations', async () => {
      routeSpy.params = {};

      locationsSpy.userLocations.and.returnValue([]);
      locationsSpy.findLocationByZipcode.and.callFake(
        (): ZipcodeAndCity | undefined => {
          return undefined;
        }
      );

      const guardResult: boolean = await firstValueFrom(
        guard(route, state) as Observable<boolean>
      );

      expect(guardResult).toBeTrue();
      expect(weatherServiceSpy.loadCurrentConditions).not.toHaveBeenCalled();
    });

    it('should correctly detect zipcode in child routes and fetch data', async () => {
      const zipcodeInUrl: ZipCode = KNOWN_LOCATIONS[1].zipcode;
      routeSpy.params = { [PathParams.ZIPCODE]: zipcodeInUrl };

      const rootRoute = createSpyObj<ActivatedRouteSnapshot>(['params'], {
        get firstChild(): ActivatedRouteSnapshot | null {
          return routeSpy;
        },
      });
      rootRoute.params = {};

      const guardResult: boolean = await firstValueFrom(
        guard(route, state) as Observable<boolean>
      );

      expect(guardResult).toBeTrue();
      expect(weatherServiceSpy.loadCurrentConditions).toHaveBeenCalledOnceWith(
        zipcodeInUrl
      );
    });
  });
});
