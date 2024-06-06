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
import {
  mainPageSequentialGuard,
  userLocationExistGuard,
} from '@features/data-access/guards';
import { ENVIRONMENT } from '@environments/environment';

const CANNOT_ACCESS_UNKNOWN_USER_LOCATION: string =
  'You have to first add zipcode location to be able to see the forecast.';

export const appRoutes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        canActivate: [
          mainPageSequentialGuard({
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
        ],
      },
      {
        path: `${Paths.FORECAST}/:${PathParams.ZIPCODE}`,
        component: ForecastDetailsPageComponent,
        canActivate: [
          userLocationExistGuard({
            canAccessUnknownLocations:
              ENVIRONMENT.ALLOW_FORECAST_ACCESS_TO_UNKNOWN_LOCATIONS,
            errorMessage: CANNOT_ACCESS_UNKNOWN_USER_LOCATION,
            displayToastOnError: true,
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
