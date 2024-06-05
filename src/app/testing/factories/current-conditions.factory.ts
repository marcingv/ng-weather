import { CurrentConditions } from '@core/types';

export class CurrentConditionsFactory {
  public static createInstance(
    params?: Partial<CurrentConditions>
  ): CurrentConditions {
    if (!params) {
      params = {};
    }

    return {
      coord: params.coord ?? {
        lon: -73.9967,
        lat: 40.7484,
      },
      weather: params.weather ?? [
        {
          id: 804,
          main: 'Clouds',
          description: 'overcast clouds',
          icon: '04d',
        },
      ],
      base: params.base ?? 'stations',
      main: params.main ?? {
        temp: 71.85,
        feels_like: 71.94,
        temp_min: 67.14,
        temp_max: 74.91,
        pressure: 1013,
        humidity: 68,
      },
      visibility: params.visibility ?? 10000,
      wind: params.wind ?? {
        speed: 3,
        deg: 207,
        gust: 5.01,
      },
      clouds: params.clouds ?? {
        all: 100,
      },
      dt: params.dt ?? 1717416054,
      sys: params.sys ?? {
        type: 2,
        id: 2083229,
        country: 'US',
        sunrise: 1717406768,
        sunset: 1717460559,
      },
      timezone: params.timezone ?? -14400,
      id: params.id ?? 0,
      name: params.name ?? 'New York',
      cod: params.cod ?? 200,
    };
  }
}
