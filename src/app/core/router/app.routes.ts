import { Routes } from '@angular/router';
import { MainPageComponent } from '@pages/main-page';
import { PathParams } from './path-params';
import { Paths } from './paths';
import { MainLayoutComponent } from '@ui/layouts/main-layout';
import { ForecastDetailsPageComponent } from '@pages/forecast-details-page';
import { locationForecastResolver } from '@features/data-access-forecasts/resolvers';

export const appRoutes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: MainPageComponent,
      },
      {
        path: `${Paths.FORECAST}/:${PathParams.ZIPCODE}`,
        component: ForecastDetailsPageComponent,
        resolve: {
          data: locationForecastResolver(),
        },
      },
      {
        path: Paths.WILDCARD,
        redirectTo: '',
      },
    ],
  },
];
