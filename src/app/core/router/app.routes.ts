import { Routes } from '@angular/router';
import { WeatherConditionsPageComponent } from 'src/app/pages/weather-conditions-page';
import { PathParams } from './path-params';
import { Paths } from './paths';
import { MainLayoutComponent } from '@ui/layouts/main-layout';
import { ForecastDetailsPageComponent } from '@pages/forecast-details-page';
import {
  forecastPageTitleResolver,
  locationForecastResolver,
  weatherConditionsPageTitleResolver,
} from '@features/data-access/resolvers';
import {
  weatherConditionsPageGuard,
  userLocationExistGuard,
} from '@features/data-access/guards';
import { ENVIRONMENT } from '@environments/environment';

const CANNOT_ACCESS_UNKNOWN_USER_LOCATION: string =
  'You have to first add zipcode location to be able to see the forecast.';

const WEATHER_CONDITIONS_ROUTES: Routes = [
  {
    path: Paths.WEATHER,
    title: weatherConditionsPageTitleResolver,
    canActivate: [
      weatherConditionsPageGuard({
        preloadingStrategy: ENVIRONMENT.WEATHER_CONDITIONS_PRELOADING_STRATEGY,
      }),
    ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: `${Paths.ROOT}/${Paths.WEATHER}/`,
      },
      {
        path: `:${PathParams.ZIPCODE}`,
        component: WeatherConditionsPageComponent,
        title: weatherConditionsPageTitleResolver,
      },
    ],
  },
];

const FORECAST_DETAILS_ROUTES: Routes = [
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
];

export const appRoutes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      ...WEATHER_CONDITIONS_ROUTES,
      ...FORECAST_DETAILS_ROUTES,
      {
        path: Paths.WILDCARD,
        redirectTo: '/' + Paths.WEATHER,
      },
    ],
  },
];
