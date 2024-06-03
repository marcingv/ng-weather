export interface AppEnvironmentConfig {
  PRODUCTION: boolean;
  OPEN_WEATHER: {
    APP_ID: string;
    API_URL: string;
  };
  DAILY_FORECAST_DAYS: number;
  CACHE_LIFESPAN_MILLIS: number;
}
