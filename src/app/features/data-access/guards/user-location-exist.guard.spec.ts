import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  GuardResult,
  provideRouter,
  RedirectCommand,
  RouterStateSnapshot,
} from '@angular/router';
import { userLocationExistGuard } from './user-location-exist.guard';
import { LocationService } from '@features/data-access/services';
import { ZipcodeAndCity } from '@features/data-access/types';
import { ZipCode } from '@core/types';
import { ToastsService } from '@ui/toasts/services/toasts.service';
import { PathParams } from '@core/router/path-params';
import { Paths } from '@core/router/paths';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('userLocationExistGuard', () => {
  let locationsSpy: SpyObj<LocationService>;
  let toastsServiceSpy: SpyObj<ToastsService>;

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

    toastsServiceSpy = createSpyObj<ToastsService>(['showWithDelay', 'show']);
  });

  describe('Guard without access to unknown locations', () => {
    let guard: CanActivateFn;

    beforeEach((): void => {
      TestBed.configureTestingModule({
        providers: [
          provideRouter([]),
          { provide: LocationService, useValue: locationsSpy },
          { provide: ToastsService, useValue: toastsServiceSpy },
        ],
      });

      guard = (...guardParameters) =>
        TestBed.runInInjectionContext(() =>
          userLocationExistGuard({ canAccessUnknownLocations: false })(
            ...guardParameters
          )
        );
    });

    it('should be created', () => {
      expect(guard).toBeTruthy();
    });

    it('should allow access to known user location', (): void => {
      routeSpy.params = { [PathParams.ZIPCODE]: KNOWN_LOCATIONS[0].zipcode };

      expect(guard(route, state)).toBeTrue();
      expect(toastsServiceSpy.showWithDelay).not.toHaveBeenCalled();
    });

    it('should deny access to unknown user location', (): void => {
      routeSpy.params = { [PathParams.ZIPCODE]: UNKNOWN_LOCATIONS_ZIPCODES[0] };

      const result: GuardResult = guard(route, state) as GuardResult;

      expect(result).toBeInstanceOf(RedirectCommand);
      expect((result as RedirectCommand).redirectTo.toString()).toEqual(
        Paths.ROOT
      );
      expect(toastsServiceSpy.showWithDelay).toHaveBeenCalled();
    });
  });

  describe('Guard with custom error redirect path', () => {
    let guard: CanActivateFn;
    const customRedirectPath: string = '/my/custom/error/path';

    beforeEach((): void => {
      TestBed.configureTestingModule({
        providers: [
          provideRouter([]),
          { provide: LocationService, useValue: locationsSpy },
          { provide: ToastsService, useValue: toastsServiceSpy },
        ],
      });

      guard = (...guardParameters) =>
        TestBed.runInInjectionContext(() =>
          userLocationExistGuard({
            canAccessUnknownLocations: false,
            onErrorRedirectToUrl: customRedirectPath,
          })(...guardParameters)
        );
    });

    it('should be created', () => {
      expect(guard).toBeTruthy();
    });

    it('should redirect user to custom error path on access denied', (): void => {
      routeSpy.params = { [PathParams.ZIPCODE]: UNKNOWN_LOCATIONS_ZIPCODES[0] };

      const result: GuardResult = guard(route, state) as GuardResult;

      expect(result).toBeInstanceOf(RedirectCommand);
      expect((result as RedirectCommand).redirectTo.toString()).toEqual(
        customRedirectPath
      );
      expect(toastsServiceSpy.showWithDelay).toHaveBeenCalled();
    });
  });

  describe('Guard with access to unknown locations', () => {
    let guard: CanActivateFn;

    beforeEach((): void => {
      TestBed.configureTestingModule({
        providers: [
          provideRouter([]),
          { provide: LocationService, useValue: locationsSpy },
          { provide: ToastsService, useValue: toastsServiceSpy },
        ],
      });

      guard = (...guardParameters) =>
        TestBed.runInInjectionContext(() =>
          userLocationExistGuard({ canAccessUnknownLocations: true })(
            ...guardParameters
          )
        );
    });

    it('should be created', () => {
      expect(guard).toBeTruthy();
    });

    it('should allow to access unknown user location', (): void => {
      routeSpy.params = { [PathParams.ZIPCODE]: UNKNOWN_LOCATIONS_ZIPCODES[0] };

      const result: GuardResult = guard(route, state) as GuardResult;

      expect(result).toBeTrue();
      expect(toastsServiceSpy.showWithDelay).not.toHaveBeenCalled();
    });
  });
});
