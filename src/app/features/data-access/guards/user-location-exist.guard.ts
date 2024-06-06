import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  GuardResult,
  RedirectCommand,
  Router,
  UrlTree,
} from '@angular/router';
import { ZipcodeAndCity } from '@features/data-access/types';
import { inject } from '@angular/core';
import { Paths } from '@core/router/paths';
import {
  getUserLocationBasedOnUrlPath,
  showErrorToast,
} from '@features/data-access/utils/guard-and-resolvers.utils';

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

    const location: ZipcodeAndCity | undefined =
      getUserLocationBasedOnUrlPath(route);

    if (!location && options.displayToastOnError !== false) {
      showErrorToast(options.errorMessage ?? DEFAULT_ERROR_MESSAGE);
    }
    if (!location) {
      return createRedirectCommand(options);
    }

    return true;
  };
};

const createRedirectCommand = (options: GuardOptions): RedirectCommand => {
  const router: Router = inject(Router);
  const urlTree: UrlTree = router.parseUrl(
    options.onErrorRedirectToUrl ?? Paths.ROOT
  );

  return new RedirectCommand(urlTree);
};
