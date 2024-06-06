import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RedirectCommand,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { userLocationExistGuard } from './user-location-exist.guard';
import { Paths } from '@core/router/paths';
import { inject } from '@angular/core';
import {
  WeatherConditionsPreloadingStrategy,
  ZipcodeAndCity,
} from '@features/data-access/types';
import { weatherConditionsPreloadingGuard } from './weather-conditions-preloading.guard';
import { ZipCode } from '@core/types';
import {
  getUserLocations,
  getZipcodePathParam,
} from '@features/data-access/utils/guard-and-resolvers.utils';

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
    const zipcode: ZipCode | undefined = getZipcodePathParam(route);
    const userLocations: ZipcodeAndCity[] = getUserLocations();

    if (zipcode && !userLocations.length) {
      // We don't have any location - redirect user to root url
      const router = inject(Router);

      return new RedirectCommand(router.parseUrl(Paths.ROOT));
    }

    if (!userLocations.length) {
      // We don't have zipcode nor locations - allow access
      return true;
    }

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

const executeUserLocationExistGuard = (
  options: GuardOptions,
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const doesUserLocationExistGuard = userLocationExistGuard({
    canAccessUnknownLocations: false,
    displayToastOnError: false,
    onErrorRedirectToUrl: createRedirectUrl(),
  });

  return doesUserLocationExistGuard(route, state);
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

const createRedirectUrl = (): string => {
  const router: Router = inject(Router);
  const defaultLocation: ZipcodeAndCity | undefined = getUserLocations()[0];

  return router
    .createUrlTree([
      Paths.ROOT,
      ...(defaultLocation ? [defaultLocation.zipcode] : []),
    ])
    .toString();
};
