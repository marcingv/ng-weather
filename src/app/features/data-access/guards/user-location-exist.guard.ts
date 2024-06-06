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

const DEFAULT_ERROR_MESSAGE: string =
  'Specified zipcode location has not been added yet.';

interface GuardOptions {
  canAccessUnknownLocations: boolean;
  onErrorRedirectToUrl?: string;
  displayToastOnError?: boolean;
  errorMessage?: string;
}

export const userLocationExistGuard: (
  options: GuardOptions
) => CanActivateFn = (options: GuardOptions) => {
  return (route: ActivatedRouteSnapshot): GuardResult => {
    if (options.canAccessUnknownLocations) {
      return true;
    }

    const location: ZipcodeAndCity | undefined = getUserLocation(route);
    if (!location && options.displayToastOnError !== false) {
      showErrorToast(options.errorMessage ?? DEFAULT_ERROR_MESSAGE);
    }
    if (!location) {
      return createRedirectCommand(options);
    }

    return true;
  };
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
