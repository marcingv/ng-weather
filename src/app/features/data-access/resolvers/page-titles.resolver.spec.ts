import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';

import {
  forecastPageTitleResolver,
  mainPageTitleResolver,
  PAGE_TITLES,
} from './page-titles.resolver';
import { PathParams } from '@core/router/path-params';
import { ZipcodeAndCity } from '@features/data-access/types';
import { LocationService } from '@features/data-access/services';
import { ZipCode } from '@core/types';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('PageTitlesResolvers', () => {
  let locationsSpy: SpyObj<LocationService>;
  let routeSpy: SpyObj<ActivatedRouteSnapshot>;
  let stateSpy: SpyObj<RouterStateSnapshot>;

  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  const KNOWN_LOCATIONS: ZipcodeAndCity[] = [
    { zipcode: '10001', city: 'New York' },
    { zipcode: '95742', city: 'Rancho Cordova' },
  ];

  const UNKNOWN_LOCATIONS_ZIPCODES: ZipCode[] = ['10000', '20000'];

  beforeEach(() => {
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
  });

  describe('Main Page Titles', () => {
    let resolver: ResolveFn<string>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: LocationService, useValue: locationsSpy }],
      });

      resolver = (...resolverParameters) =>
        TestBed.runInInjectionContext(() =>
          mainPageTitleResolver(...resolverParameters)
        );
    });

    it('should be created', () => {
      expect(resolver).toBeTruthy();
    });

    it('should return main title when there is no zipcode in url', () => {
      routeSpy.params = {};

      expect(resolver(route, state)).toEqual(PAGE_TITLES.MAIN);
    });

    KNOWN_LOCATIONS.forEach((oneLocation: ZipcodeAndCity) =>
      it(`should build title for known location: "${oneLocation.city} - ${oneLocation.zipcode}"`, (): void => {
        routeSpy.params = { [PathParams.ZIPCODE]: oneLocation.zipcode };

        const expectedTitle = `${oneLocation.city} (${oneLocation.zipcode}) - ${PAGE_TITLES.CURRENT_CONDITIONS} - ${PAGE_TITLES.MAIN}`;

        expect(resolver(route, state)).toEqual(expectedTitle);
      })
    );

    UNKNOWN_LOCATIONS_ZIPCODES.forEach((oneZipcode: ZipCode) =>
      it(`should build title using just zipcode when city name is not known`, (): void => {
        routeSpy.params = { [PathParams.ZIPCODE]: oneZipcode };

        const expectedTitle = `(${oneZipcode}) - ${PAGE_TITLES.CURRENT_CONDITIONS} - ${PAGE_TITLES.MAIN}`;

        expect(resolver(route, state)).toEqual(expectedTitle);
      })
    );
  });

  describe('Forecast Page Titles', () => {
    let resolver: ResolveFn<string>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: LocationService, useValue: locationsSpy }],
      });

      resolver = (...resolverParameters) =>
        TestBed.runInInjectionContext(() =>
          forecastPageTitleResolver(...resolverParameters)
        );
    });

    it('should be created', () => {
      expect(resolver).toBeTruthy();
    });

    it('should return main title when there is no zipcode in url', () => {
      routeSpy.params = {};

      const expectedTitle = `${PAGE_TITLES.WEATHER_FORECAST} - ${PAGE_TITLES.MAIN}`;

      expect(resolver(route, state)).toEqual(expectedTitle);
    });

    KNOWN_LOCATIONS.forEach((oneLocation: ZipcodeAndCity) =>
      it(`should build title for known location: "${oneLocation.city} - ${oneLocation.zipcode}"`, (): void => {
        routeSpy.params = { [PathParams.ZIPCODE]: oneLocation.zipcode };

        const expectedTitle = `${oneLocation.city} (${oneLocation.zipcode}) - ${PAGE_TITLES.WEATHER_FORECAST} - ${PAGE_TITLES.MAIN}`;

        expect(resolver(route, state)).toEqual(expectedTitle);
      })
    );

    UNKNOWN_LOCATIONS_ZIPCODES.forEach((oneZipcode: ZipCode) =>
      it(`should build title using just zipcode when city name is not known`, (): void => {
        routeSpy.params = { [PathParams.ZIPCODE]: oneZipcode };

        const expectedTitle = `(${oneZipcode}) - ${PAGE_TITLES.WEATHER_FORECAST} - ${PAGE_TITLES.MAIN}`;

        expect(resolver(route, state)).toEqual(expectedTitle);
      })
    );
  });
});
