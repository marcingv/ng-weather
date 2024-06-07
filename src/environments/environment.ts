import { AppEnvironmentConfig } from './app-environment-config';
import { BASE_ENVIRONMENT } from './_environment.base';

/**
 * This file configures LOCAL environment.
 */

export const ENVIRONMENT: AppEnvironmentConfig = {
  ...BASE_ENVIRONMENT,
  PRODUCTION: false,
  CACHE_LIFESPAN_MILLIS: 60 * 1000, // 1-minute cache
  ENABLE_APP_DEV_TOOLS: true,
};
