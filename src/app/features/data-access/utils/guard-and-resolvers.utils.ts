import { ZipcodeAndCity } from '@features/data-access/types';
import { LocationService } from '@features/data-access/services';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { ZipCode } from '@core/types';
import { PathParams } from '@core/router/path-params';
import { ToastsService } from '@ui/toasts/services/toasts.service';

export const getZipcodePathParam = (
  route: ActivatedRouteSnapshot
): ZipCode | undefined => {
  if (route.params[PathParams.ZIPCODE]) {
    return route.params[PathParams.ZIPCODE];
  }

  if (route.firstChild) {
    return getZipcodePathParam(route.firstChild);
  }

  return undefined;
};

export const getUserLocations = (): ZipcodeAndCity[] => {
  const locationsService: LocationService = inject(LocationService);

  return locationsService.userLocations();
};

export const getUserLocationBasedOnUrlPath = (
  route: ActivatedRouteSnapshot
): ZipcodeAndCity | undefined => {
  const locationsService: LocationService = inject(LocationService);
  const zipcode: ZipCode | undefined = getZipcodePathParam(route);
  if (!zipcode) {
    return undefined;
  }

  return locationsService.findLocationByZipcode(zipcode);
};

export const getUserLocationByZipcode = (
  zipcode: ZipCode
): ZipcodeAndCity | undefined => {
  return inject(LocationService).findLocationByZipcode(zipcode);
};

export const showErrorToast = (message: string): void => {
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
