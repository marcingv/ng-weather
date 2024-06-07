import { CurrentConditions, ZipCode } from '@core/types';

export interface WeatherConditionsData {
  zipcode: ZipCode;
  data?: CurrentConditions;
  isLoading?: boolean;
  isLoadError?: boolean;
  errorMessage?: string;
  fetchTimestamp?: number;
}
