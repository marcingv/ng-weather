import { AppEnvironmentConfig } from './app-environment-config';

export const BASE_ENVIRONMENT: AppEnvironmentConfig = {
  PRODUCTION: false,
  OPEN_WEATHER: {
    API_URL: 'https://api.openweathermap.org/data/2.5',
    APP_ID: '5a4b2d457ecbef9eb2a71e480b947604',
  },
  DAILY_FORECAST_DAYS: 5,
  CACHE_LIFESPAN_MILLIS: 60 * 1000,
};
