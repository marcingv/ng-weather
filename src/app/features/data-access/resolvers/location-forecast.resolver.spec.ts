import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { locationForecastResolver } from './location-forecast.resolver';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { ResolvedLocationForecast } from '@features/data-access/types';
import { WeatherApiService } from '@core/api/weather-api.service';
import { ZipCode } from '@core/types';
import { PathParams } from '@core/router/path-params';
import { ForecastFactory } from '@testing/factories';
import { HttpErrorResponse } from '@angular/common/http';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('locationForecastResolver', () => {
  let resolver: ResolveFn<Observable<ResolvedLocationForecast>>;

  let weatherApiServiceSpy: SpyObj<WeatherApiService>;
  let routeSpy: SpyObj<ActivatedRouteSnapshot>;
  let stateSpy: SpyObj<RouterStateSnapshot>;

  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  const NUM_OF_DAYS: number = 10;
  const ZIPCODE: ZipCode = '12345';

  beforeEach((): void => {
    routeSpy = createSpyObj<ActivatedRouteSnapshot>(['params']);
    stateSpy = createSpyObj<RouterStateSnapshot>(['url']);

    route = routeSpy as ActivatedRouteSnapshot;
    state = stateSpy as RouterStateSnapshot;

    weatherApiServiceSpy = createSpyObj<WeatherApiService>([
      'getDailyForecast',
    ]);
    weatherApiServiceSpy.getDailyForecast.and.returnValue(
      of(ForecastFactory.createInstance())
    );

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: WeatherApiService, useValue: weatherApiServiceSpy },
      ],
    });

    resolver = (...resolverParameters) =>
      TestBed.runInInjectionContext(() =>
        locationForecastResolver(NUM_OF_DAYS)(...resolverParameters)
      );
  });

  it('should be created', (): void => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve to data describing failure when there is no zipcode in url', async () => {
    routeSpy.params = {};

    const resolverResult = await firstValueFrom(
      resolver(route, state) as Observable<ResolvedLocationForecast>
    );

    expect(resolverResult).toBeTruthy();
    expect(resolverResult.zipcode).toEqual('');
    expect(resolverResult.forecast).toBeNull();
    expect(resolverResult.isResolveError).toBeTrue();
    expect(resolverResult.resolveErrorMessage).toBeTruthy();

    expect(weatherApiServiceSpy.getDailyForecast).not.toHaveBeenCalled();
  });

  it('should resolve to data describing failure on api error', async () => {
    weatherApiServiceSpy.getDailyForecast.and.callFake(() => {
      return throwError(() => {
        return new HttpErrorResponse({ status: 404 });
      });
    });

    routeSpy.params = { [PathParams.ZIPCODE]: ZIPCODE };

    const resolverResult = await firstValueFrom(
      resolver(route, state) as Observable<ResolvedLocationForecast>
    );

    expect(resolverResult).toBeTruthy();
    expect(resolverResult.zipcode).toEqual(ZIPCODE);
    expect(resolverResult.forecast).toBeNull();
    expect(resolverResult.isResolveError).toBeTrue();
    expect(resolverResult.resolveErrorMessage).toBeTruthy();

    expect(weatherApiServiceSpy.getDailyForecast).toHaveBeenCalledOnceWith(
      ZIPCODE,
      NUM_OF_DAYS
    );
  });

  it('should fetch and deliver forecast', async () => {
    routeSpy.params = { [PathParams.ZIPCODE]: ZIPCODE };

    const resolverResult = await firstValueFrom(
      resolver(route, state) as Observable<ResolvedLocationForecast>
    );

    expect(resolverResult).toBeTruthy();
    expect(resolverResult.zipcode).toEqual(ZIPCODE);
    expect(resolverResult.forecast).toBeTruthy();
    expect(resolverResult.isResolveError).toBeFalse();
    expect(resolverResult.resolveErrorMessage).toBeUndefined();

    expect(weatherApiServiceSpy.getDailyForecast).toHaveBeenCalledOnceWith(
      ZIPCODE,
      NUM_OF_DAYS
    );
  });
});
