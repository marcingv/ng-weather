import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from '@core/router/app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { ENVIRONMENT } from '@environments/environment';
import { cachedHttpRequestsInterceptor } from '@core/cache/interceptors/cached-http-requests.interceptor';
import { provideAppDevTools } from '@testing/dev-tools/configuration';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([
        cachedHttpRequestsInterceptor({
          urls: [ENVIRONMENT.OPEN_WEATHER.API_URL],
          methods: ['GET'],
        }),
      ])
    ),
    provideServiceWorker('/ngsw-worker.js', {
      enabled: ENVIRONMENT.PRODUCTION,
    }),
    provideAppDevTools({ enabled: ENVIRONMENT.ENABLE_APP_DEV_TOOLS }),
    provideAnimationsAsync(),
  ],
};
