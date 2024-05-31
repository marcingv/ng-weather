import { Forecast, ZipCode } from '@core/types';

export interface ResolvedLocationForecast {
  zipcode: ZipCode;
  forecast: Forecast | null;
  isResolveError: boolean;
  resolveErrorMessage?: string;
}
