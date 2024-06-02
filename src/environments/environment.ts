// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import { AppEnvironmentConfig } from './app-environment-config';
import { BASE_ENVIRONMENT } from './_environment.base';

export const ENVIRONMENT: AppEnvironmentConfig = {
  ...BASE_ENVIRONMENT,
  PRODUCTION: false,
};
