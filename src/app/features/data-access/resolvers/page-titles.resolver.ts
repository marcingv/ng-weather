import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { LocationService } from '@features/data-access/services';
import { ZipCode } from '@core/types';
import { PathParams } from '@core/router/path-params';
import { ZipcodeAndCity } from '@features/data-access/types';

declare type ZipcodeAndOptionalCity = Partial<ZipcodeAndCity> &
  Pick<ZipcodeAndCity, 'zipcode'>;

export const PAGE_TITLES = {
  MAIN: 'NgWeather',
  CURRENT_CONDITIONS: 'Current conditions',
  WEATHER_FORECAST: 'Forecast',
};

export const mainPageTitleResolver: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
): string => {
  const location: ZipcodeAndOptionalCity | undefined = getLocation(route);

  return location
    ? buildTitle([formatLocation(location), PAGE_TITLES.CURRENT_CONDITIONS])
    : buildTitle([]);
};

export const forecastPageTitleResolver: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
): string => {
  const location: ZipcodeAndOptionalCity | undefined = getLocation(route);

  return location
    ? buildTitle([formatLocation(location), PAGE_TITLES.WEATHER_FORECAST])
    : buildTitle([PAGE_TITLES.WEATHER_FORECAST]);
};

const buildTitle = (parts: string[]): string => {
  return [...parts, PAGE_TITLES.MAIN].join(' - ');
};

const formatLocation = (location: ZipcodeAndOptionalCity): string => {
  const parts: string[] = [];
  if (location.city) {
    parts.push(location.city);
  }
  parts.push(`(${location.zipcode})`);

  return parts.join(' ');
};

const getLocation = (
  route: ActivatedRouteSnapshot
): ZipcodeAndOptionalCity | undefined => {
  const locationService = inject(LocationService);
  const zipcode: ZipCode | undefined = route.params[PathParams.ZIPCODE];
  if (!zipcode) {
    return undefined;
  }

  const location = locationService
    .userLocations()
    .find(oneLocation => oneLocation.zipcode === zipcode);

  return location ? location : { zipcode: zipcode };
};
