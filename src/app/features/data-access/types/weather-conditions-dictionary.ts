import { ZipCode } from '@core/types/zip-code';
import { WeatherConditionsData } from './weather-conditions-data';

export type WeatherConditionsDictionary = {
  [zipcode: ZipCode]: WeatherConditionsData;
};
