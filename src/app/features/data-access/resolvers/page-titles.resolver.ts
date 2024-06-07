import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { ZipCode } from '@core/types';
import { ZipcodeAndCity } from '@features/data-access/types';
import {
  getUserLocationByZipcode,
  getZipcodePathParam,
} from '@features/data-access/utils/guard-and-resolvers.utils';

declare type ZipcodeAndOptionalCity = Partial<ZipcodeAndCity> &
  Pick<ZipcodeAndCity, 'zipcode'>;

export const PAGE_TITLES = {
  MAIN: 'NgWeather',
  CURRENT_CONDITIONS: 'Current conditions',
  WEATHER_FORECAST: 'Forecast',
};

export const weatherConditionsPageTitleResolver: ResolveFn<string> = (
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
  const zipcode: ZipCode | undefined = getZipcodePathParam(route);
  if (!zipcode) {
    return undefined;
  }

  const location: ZipcodeAndCity | undefined =
    getUserLocationByZipcode(zipcode);

  return location ? location : { zipcode: zipcode };
};
