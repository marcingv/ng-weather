import { WeatherConditionsPreloadingStrategy } from '@features/data-access/types';

export interface AppEnvironmentConfig {
  PRODUCTION: boolean;
  OPEN_WEATHER: {
    APP_ID: string;
    API_URL: string;
  };
  DAILY_FORECAST_DAYS: number;
  CACHE_LIFESPAN_MILLIS: number;
  ENABLE_APP_DEV_TOOLS: boolean;

  /**
   * This parameter specifies whether the application should allow access to the forecast details page for unknown locations.
   */
  ALLOW_FORECAST_ACCESS_TO_UNKNOWN_LOCATIONS: boolean;

  /**
   * This parameter specifies how weather conditions data should be fetched:
   *
   * Eager fetching - application fetches weather conditions for all known users locations - ALL AT ONCE
   *
   * On demand fetching - application fetches weather conditions LAZILY. API request are made only for data that is required at the moment.
   */
  WEATHER_CONDITIONS_PRELOADING_STRATEGY: WeatherConditionsPreloadingStrategy;
}
