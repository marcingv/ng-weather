import { ZipCode } from './zip-code';
import { ConditionsAndZip } from '@core/types/conditions-and-zip';

export type WeatherConditionsDictionary = {
  [zipcode: ZipCode]: ConditionsAndZip;
};
