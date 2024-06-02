import { AppEnvironmentConfig } from './app-environment-config';
import { BASE_ENVIRONMENT } from './_environment.base';

export const ENVIRONMENT: AppEnvironmentConfig = {
  ...BASE_ENVIRONMENT,
  PRODUCTION: true,
};
