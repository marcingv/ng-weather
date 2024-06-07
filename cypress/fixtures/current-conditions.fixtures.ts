import { CurrentConditions } from '@core/types';
import { CurrentConditions10001 } from './current-conditions-10001';
import { CurrentConditions95742 } from './current-conditions-95742';

export enum REQUEST_ZIPCODES {
  ZIP_10001 = '10001',
  ZIP_95742 = '95742',
}

export const CURRENT_CONDITIONS_RESPONSES: Record<
  REQUEST_ZIPCODES,
  CurrentConditions
> = {
  [REQUEST_ZIPCODES.ZIP_10001]: CurrentConditions10001,
  [REQUEST_ZIPCODES.ZIP_95742]: CurrentConditions95742,
};
