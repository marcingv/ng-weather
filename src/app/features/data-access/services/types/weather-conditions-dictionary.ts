import { ZipCode } from '@core/types/zip-code';
import { WeatherConditionsData } from '@features/data-access/services';

export type WeatherConditionsDictionary = {
  [zipcode: ZipCode]: WeatherConditionsData;
};
