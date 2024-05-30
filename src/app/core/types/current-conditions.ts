import { Clouds } from './clouds';
import { ConditionsMain } from './conditions-main';
import { ConditionsSys } from './conditions-sys';
import { ConditionsWind } from './conditions-wind';
import { Coord } from './coord';
import { Weather } from './weather';

export interface CurrentConditions {
  coord: Coord;
  weather: Weather[];
  base: string;
  main: ConditionsMain;
  visibility: number;
  wind: ConditionsWind;
  clouds: Clouds;
  dt: number;
  sys: ConditionsSys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}
