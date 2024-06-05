import { APP_INITIALIZER } from '@angular/core';
import { devToolsEnvironmentInitializer } from '@testing/dev-tools/initializers/dev-tools-environment.initializer';

export const provideAppDevTools = (
  options: { enabled: boolean } = { enabled: true }
) =>
  options.enabled
    ? [
        {
          provide: APP_INITIALIZER,
          useFactory: devToolsEnvironmentInitializer,
          multi: true,
        },
      ]
    : [];
