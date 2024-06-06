import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  GuardResult,
  RedirectCommand,
  Router,
  UrlTree,
} from '@angular/router';
import { ZipCode } from '@core/types';
import { PathParams } from '@core/router/path-params';
import { ZipcodeAndCity } from '@features/data-access/types';
import { inject } from '@angular/core';
import { LocationService } from '@features/data-access/services';
import { ToastsService } from '@ui/toasts/services/toasts.service';
import { Paths } from '@core/router/paths';

const CANNOT_ACCESS_UNKNOWN_USER_LOCATION =
  'You have to first add zipcode location to be able to see the forecast.';

interface GuardOptions {
  canAccessUnknownLocations: boolean;
  onErrorRedirectToUrl?: string;
}

export const locationForecastGuard: (options: GuardOptions) => CanActivateFn = (
  options: GuardOptions
) => {
  return (route: ActivatedRouteSnapshot): GuardResult => {
    if (options.canAccessUnknownLocations) {
      return true;
    }

    const location: ZipcodeAndCity | undefined = getUserLocation(route);
    if (!location) {
      showErrorToast(CANNOT_ACCESS_UNKNOWN_USER_LOCATION);

      return createRedirectCommand(options);
    }

    return true;
  };
};

const getZipcode = (route: ActivatedRouteSnapshot): ZipCode | undefined => {
  return route.params[PathParams.ZIPCODE];
};

const getUserLocation = (
  route: ActivatedRouteSnapshot
): ZipcodeAndCity | undefined => {
  const locations: LocationService = inject(LocationService);
  const zipcode: ZipCode | undefined = getZipcode(route);
  if (!zipcode) {
    return undefined;
  }

  return locations.findLocationByZipcode(zipcode);
};

const showErrorToast = (message: string): void => {
  const toastsService: ToastsService | null = inject(ToastsService, {
    optional: true,
  });
  if (!toastsService) {
    return;
  }

  toastsService.showWithDelay({
    severity: 'error',
    message: message,
  });
};

const createRedirectCommand = (options: GuardOptions): RedirectCommand => {
  const router: Router = inject(Router);
  const urlTree: UrlTree = router.parseUrl(
    options.onErrorRedirectToUrl ?? Paths.ROOT
  );

  return new RedirectCommand(urlTree);
};
