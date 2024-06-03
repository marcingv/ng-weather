import { CurrentConditions, ZipCode } from '@core/types';

export interface WeatherConditionsData {
  zip: ZipCode;
  data?: CurrentConditions;
  isLoading?: boolean;
  isLoadError?: boolean;
  errorMessage?: string;
  fetchTimestamp?: number;
}
