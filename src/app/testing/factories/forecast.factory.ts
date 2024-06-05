import { Forecast } from '@core/types';

export class ForecastFactory {
  public static createInstance(params?: Partial<Forecast>): Forecast {
    if (!params) {
      params = {};
    }

    return {
      city: params.city ?? {
        id: 0,
        name: 'New York',
        coord: {
          lon: -74.0253,
          lat: 40.6964,
        },
        country: 'US',
        population: 0,
        timezone: -14400,
      },
      cod: params.cod ?? '200',
      message: params.message ?? 0.0916024,
      cnt: params.cnt ?? 5,
      list: params.list ?? [
        {
          dt: 1717171200,
          sunrise: 1717147657,
          sunset: 1717201227,
          temp: {
            day: 71.04,
            min: 60.01,
            max: 76.42,
            night: 66.16,
            eve: 75.09,
            morn: 60.01,
          },
          feels_like: {
            day: 69.58,
            night: 64.74,
            eve: 73.67,
            morn: 58.01,
          },
          pressure: 1022,
          humidity: 37,
          weather: [
            {
              id: 800,
              main: 'Clear',
              description: 'sky is clear',
              icon: '01d',
            },
          ],
          speed: 15.12,
          deg: 326,
          gust: 23.02,
          clouds: 0,
          pop: 0,
        },
        {
          dt: 1717257600,
          sunrise: 1717234031,
          sunset: 1717287671,
          temp: {
            day: 78.64,
            min: 61.61,
            max: 83.05,
            night: 71.62,
            eve: 82.08,
            morn: 61.61,
          },
          feels_like: {
            day: 77.67,
            night: 70.92,
            eve: 80.46,
            morn: 59.83,
          },
          pressure: 1021,
          humidity: 31,
          weather: [
            {
              id: 800,
              main: 'Clear',
              description: 'sky is clear',
              icon: '01d',
            },
          ],
          speed: 12.37,
          deg: 330,
          gust: 28.48,
          clouds: 3,
          pop: 0,
        },
        {
          dt: 1717344000,
          sunrise: 1717320407,
          sunset: 1717374114,
          temp: {
            day: 77.5,
            min: 65.53,
            max: 78.96,
            night: 73.49,
            eve: 77.27,
            morn: 65.53,
          },
          feels_like: {
            day: 76.55,
            night: 72.93,
            eve: 76.82,
            morn: 64.33,
          },
          pressure: 1018,
          humidity: 34,
          weather: [
            {
              id: 804,
              main: 'Clouds',
              description: 'overcast clouds',
              icon: '04d',
            },
          ],
          speed: 10.6,
          deg: 205,
          gust: 13.38,
          clouds: 100,
          pop: 0,
        },
        {
          dt: 1717430400,
          sunrise: 1717406785,
          sunset: 1717460556,
          temp: {
            day: 75.87,
            min: 67.55,
            max: 78.46,
            night: 69.46,
            eve: 77,
            morn: 67.55,
          },
          feels_like: {
            day: 75.6,
            night: 69.49,
            eve: 76.6,
            morn: 67.53,
          },
          pressure: 1015,
          humidity: 52,
          weather: [
            {
              id: 802,
              main: 'Clouds',
              description: 'scattered clouds',
              icon: '03d',
            },
          ],
          speed: 10.54,
          deg: 163,
          gust: 19.53,
          clouds: 26,
          pop: 0.01,
        },
        {
          dt: 1717516800,
          sunrise: 1717493165,
          sunset: 1717546996,
          temp: {
            day: 78.42,
            min: 67.19,
            max: 78.42,
            night: 68.65,
            eve: 75.18,
            morn: 67.19,
          },
          feels_like: {
            day: 78.13,
            night: 68.56,
            eve: 74.75,
            morn: 67.19,
          },
          pressure: 1016,
          humidity: 46,
          weather: [
            {
              id: 800,
              main: 'Clear',
              description: 'sky is clear',
              icon: '01d',
            },
          ],
          speed: 12.24,
          deg: 158,
          gust: 15.12,
          clouds: 4,
          pop: 0,
        },
      ],
    };
  }
}
