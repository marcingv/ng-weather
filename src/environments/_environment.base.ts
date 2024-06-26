import { AppEnvironmentConfig } from './app-environment-config';

/**
 * This file contains configuration defaults for all environments.
 */

export const BASE_ENVIRONMENT: AppEnvironmentConfig = {
  PRODUCTION: false,
  OPEN_WEATHER: {
    API_URL: 'https://api.openweathermap.org/data/2.5',
    APP_ID: '5a4b2d457ecbef9eb2a71e480b947604',
  },
  DAILY_FORECAST_DAYS: 5,
  CACHE_LIFESPAN_MILLIS: 60 * 1000,
  ENABLE_APP_DEV_TOOLS: false,
  ALLOW_FORECAST_ACCESS_TO_UNKNOWN_LOCATIONS: false,
  WEATHER_CONDITIONS_PRELOADING_STRATEGY: 'on-demand-data-fetching',
};
