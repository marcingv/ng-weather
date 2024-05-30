import { FeelsLike } from './feels-like';
import { Temp } from './temp';
import { Weather } from './weather';

export interface ForecastEntries {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: Temp;
  feels_like: FeelsLike;
  pressure: number;
  humidity: number;
  weather: Weather[];
  speed: number;
  deg: number;
  gust: number;
  clouds: number;
  pop: number;
  rain?: number;
}
