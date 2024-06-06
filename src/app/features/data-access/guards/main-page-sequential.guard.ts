import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { userLocationExistGuard } from './user-location-exist.guard';
import { Paths } from '@core/router/paths';
import { inject } from '@angular/core';
import { LocationService } from '@features/data-access/services';
import {
  WeatherConditionsPreloadingStrategy,
  ZipcodeAndCity,
} from '@features/data-access/types';
import { weatherConditionsPreloadingGuard } from './weather-conditions-preloading.guard';

interface GuardOptions {
  preloadingStrategy: WeatherConditionsPreloadingStrategy;
}

/**
 * This guard uses and synchronizes two other guards to perform its task
 */
export const mainPageSequentialGuard: (
  options: GuardOptions
) => CanActivateFn = (options: GuardOptions) => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const doesUserLocationExist = executeUserLocationExistGuard(
      options,
      route,
      state
    );
    if (doesUserLocationExist !== true) {
      // Access denied by first guard - we stop here
      return doesUserLocationExist;
    }

    // Continue with preloading guard:
    return executeWeatherDataPreloadingGuard(options, route, state);
  };
};

const executeWeatherDataPreloadingGuard = (
  options: GuardOptions,
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const preloadingGuard = weatherConditionsPreloadingGuard({
    preloadingStrategy: options.preloadingStrategy,
  });

  return preloadingGuard(route, state);
};

const executeUserLocationExistGuard = (
  options: GuardOptions,
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  // Build redirect URL to first user location
  const router: Router = inject(Router);
  const locationsService: LocationService = inject(LocationService);
  const defaultLocation: ZipcodeAndCity | undefined =
    locationsService.userLocations()[0];

  const errorRedirectUrl: string = router
    .createUrlTree([
      Paths.ROOT,
      ...(defaultLocation ? [defaultLocation.zipcode] : []),
    ])
    .toString();

  const doesUserLocationExistGuard = userLocationExistGuard({
    canAccessUnknownLocations: false,
    displayToastOnError: false,
    onErrorRedirectToUrl: errorRedirectUrl,
  });

  return doesUserLocationExistGuard(route, state);
};
