import { Routes } from '@angular/router';
import { ForecastsListComponent } from '@features/forecasts-list';
import { MainPageComponent } from '@pages/main-page';
import { PathParams } from './path-params';
import { Paths } from './paths';

export const appRoutes: Routes = [
  {
    path: '',
    component: MainPageComponent,
  },
  {
    path: `${Paths.FORECAST}/:${PathParams.ZIPCODE}`,
    component: ForecastsListComponent,
  },
];
