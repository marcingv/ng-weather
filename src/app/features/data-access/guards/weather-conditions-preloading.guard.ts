import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import {
  WeatherConditionsData,
  WeatherConditionsPreloadingStrategy,
  ZipcodeAndCity,
} from '@features/data-access/types';
import { ZipCode } from '@core/types';
import { PathParams } from '@core/router/path-params';
import { inject } from '@angular/core';
import {
  LocationService,
  WeatherService,
} from '@features/data-access/services';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';

interface GuardOptions {
  preloadingStrategy: WeatherConditionsPreloadingStrategy;
}

export const weatherConditionsPreloadingGuard: (
  options: GuardOptions
) => CanActivateFn = (options: GuardOptions) => {
  return (route: ActivatedRouteSnapshot): Observable<boolean> => {
    if (options.preloadingStrategy === 'eager-data-fetching') {
      return loadWeatherConditionsEagerly();
    } else {
      return loadWeatherConditionsLazily(route);
    }
  };
};

const loadWeatherConditionsLazily = (
  route: ActivatedRouteSnapshot
): Observable<true> => {
  const weatherService: WeatherService = inject(WeatherService);
  const currentZipcode: ZipCode | undefined = getZipcode(route);
  const userLocations: ZipcodeAndCity[] = getUserLocations();
  const userLocationsZipcodes: ZipCode[] = userLocations.map(
    (oneLocation: ZipcodeAndCity) => oneLocation.zipcode
  );

  let zipcodeToFetch: ZipCode | undefined;
  if (currentZipcode && userLocationsZipcodes.includes(currentZipcode)) {
    // We try to fetch weather conditions for zipcode specified in URL
    zipcodeToFetch = currentZipcode;
  } else if (userLocationsZipcodes.length) {
    // When zipcode in URL is not correct, we fetch the very fist user's location (this tab would be displayed by default in UI)
    zipcodeToFetch = userLocationsZipcodes[0];
  } else {
    // We have nothing to fetch
    zipcodeToFetch = undefined;
  }

  if (zipcodeToFetch === undefined) {
    // We have nothing to fetch - user has not added any location yet
    return of(true);
  }

  // Fetching weather conditions for zipcode which is going to be displayed in UI after navigation
  return weatherService.loadCurrentConditions(zipcodeToFetch).pipe(
    catchError(() => {
      /**
       * Catching an error just in case if it was not handled by the above service.
       * Here we always want to complete and allow access from the guard,
       * even if data fetching has failed. In such case an error in UI
       * should be displayed (but it's not the responsibility of this guard).
       */
      return of(true);
    }),
    map((): true => true)
  );
};

const loadWeatherConditionsEagerly = (): Observable<true> => {
  const weatherService: WeatherService = inject(WeatherService);
  const userLocations: ZipcodeAndCity[] = getUserLocations();

  const requests$: Observable<WeatherConditionsData>[] = [];
  userLocations.forEach((oneLocation: ZipcodeAndCity): void => {
    requests$.push(
      weatherService.loadCurrentConditions(oneLocation.zipcode).pipe(
        catchError(() => {
          /**
           * Catching an error just in case if it was not handled by the above service.
           * Here we always want to complete and allow access from the guard,
           * even if data fetching has failed. In such case an error in UI
           * should be displayed (but it's not the responsibility of this guard).
           */
          return of({
            zip: oneLocation.zipcode,
            isLoadError: true,
          } satisfies WeatherConditionsData);
        })
      )
    );
  });

  return forkJoin(requests$).pipe(map((): true => true));
};

const getZipcode = (route: ActivatedRouteSnapshot): ZipCode | undefined => {
  if (route.params[PathParams.ZIPCODE]) {
    return route.params[PathParams.ZIPCODE];
  }

  if (route.firstChild) {
    return getZipcode(route.firstChild);
  }

  return undefined;
};

const getUserLocations = (): ZipcodeAndCity[] => {
  const locations: LocationService = inject(LocationService);

  return locations.userLocations();
};
