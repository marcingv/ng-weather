import { City } from './city';
import { ForecastEntries } from './forecast-entries';

export interface Forecast {
  city: City;
  cod: string;
  message: number;
  cnt: number;
  list: ForecastEntries[];
}
