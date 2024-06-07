import { CurrentConditions } from '@core/types';

export const CurrentConditions10001: CurrentConditions = {
  coord: {
    lon: -73.9967,
    lat: 40.7484,
  },
  weather: [
    {
      id: 803,
      main: 'Clouds',
      description: 'broken clouds',
      icon: '04d',
    },
  ],
  base: 'stations',
  main: {
    temp: 67.53,
    feels_like: 67.93,
    temp_min: 62.78,
    temp_max: 71.1,
    pressure: 1003,
    humidity: 84,
  },
  visibility: 10000,
  wind: {
    speed: 3,
    deg: 305,
    gust: 5.01,
  },
  clouds: {
    all: 62,
  },
  dt: 1717757806,
  sys: {
    type: 2,
    id: 2083229,
    country: 'US',
    sunrise: 1717752298,
    sunset: 1717806312,
  },
  timezone: -14400,
  id: 0,
  name: 'New York',
  cod: 200,
};
