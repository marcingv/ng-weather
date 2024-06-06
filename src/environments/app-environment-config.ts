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
}
