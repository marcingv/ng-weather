import { CurrentConditions, Forecast } from '@core/types';
import { CurrentConditions10001 } from './current-conditions-10001';
import { CurrentConditions95742 } from './current-conditions-95742';
import { CurrentConditions30002 } from './current-conditions-30002';
import { Forecast10001 } from './forecast-10001';
import { Forecast30002 } from './forecast-30002';
import { Forecast95742 } from './forecast-95742';

export enum REQUEST_ZIPCODES {
  ZIP_10001 = '10001',
  ZIP_95742 = '95742',
  ZIP_30002 = '30002',
}

export const CURRENT_CONDITIONS_RESPONSES: Record<
  REQUEST_ZIPCODES,
  CurrentConditions
> = {
  [REQUEST_ZIPCODES.ZIP_10001]: CurrentConditions10001,
  [REQUEST_ZIPCODES.ZIP_30002]: CurrentConditions30002,
  [REQUEST_ZIPCODES.ZIP_95742]: CurrentConditions95742,
};

export const FORECAST_RESPONSES: Record<REQUEST_ZIPCODES, Forecast> = {
  [REQUEST_ZIPCODES.ZIP_10001]: Forecast10001,
  [REQUEST_ZIPCODES.ZIP_30002]: Forecast30002,
  [REQUEST_ZIPCODES.ZIP_95742]: Forecast95742,
};
