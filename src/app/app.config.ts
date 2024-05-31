import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from '@core/router/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { ENVIRONMENT } from '@environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(),
    provideServiceWorker('/ngsw-worker.js', {
      enabled: ENVIRONMENT.PRODUCTION,
    }),
  ],
};
