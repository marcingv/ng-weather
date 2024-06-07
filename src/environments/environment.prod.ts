import { AppEnvironmentConfig } from './app-environment-config';
import { BASE_ENVIRONMENT } from './_environment.base';

/**
 * This file configures PROD environment.
 */

export const ENVIRONMENT: AppEnvironmentConfig = {
  ...BASE_ENVIRONMENT,
  PRODUCTION: true,
  CACHE_LIFESPAN_MILLIS: 2 * 60 * 60 * 1000, // 2-hour cache
  ENABLE_APP_DEV_TOOLS: true, // Enabled to make it easier for the Angular Training Team to verify app behavior. Normally it would be disabled in production deployment.
};
