import { Routes } from '@angular/router';
import { MainPageComponent } from '@pages/main-page';
import { PathParams } from './path-params';
import { Paths } from './paths';
import { MainLayoutComponent } from '@ui/layouts/main-layout';
import { ForecastDetailsPageComponent } from '@pages/forecast-details-page';
import {
  forecastPageTitleResolver,
  locationForecastResolver,
  mainPageTitleResolver,
} from '@features/data-access/resolvers';
import { locationForecastGuard } from '@features/data-access/guards';
import { ENVIRONMENT } from '@environments/environment';
import { weatherConditionsPreloadingGuard } from '@features/data-access/guards/weather-conditions-preloading.guard';

export const appRoutes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        canActivate: [
          weatherConditionsPreloadingGuard({
            preloadingStrategy:
              ENVIRONMENT.WEATHER_CONDITIONS_PRELOADING_STRATEGY,
          }),
        ],
        children: [
          {
            path: '',
            component: MainPageComponent,
            title: mainPageTitleResolver,
          },
          {
            path: `:${PathParams.ZIPCODE}`,
            component: MainPageComponent,
            title: mainPageTitleResolver,
          },
          { path: Paths.WILDCARD, redirectTo: '' },
        ],
      },
      {
        path: `${Paths.FORECAST}/:${PathParams.ZIPCODE}`,
        component: ForecastDetailsPageComponent,
        canActivate: [
          locationForecastGuard({
            canAccessUnknownLocations:
              ENVIRONMENT.ALLOW_FORECAST_ACCESS_TO_UNKNOWN_LOCATIONS,
          }),
        ],
        resolve: {
          data: locationForecastResolver(),
        },
        title: forecastPageTitleResolver,
      },
      {
        path: Paths.WILDCARD,
        redirectTo: '',
      },
    ],
  },
];
