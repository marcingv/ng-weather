import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  signal,
} from '@angular/core';
import { WeatherService } from '@features/data-access-forecasts/services';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Forecast, ZipCode } from 'src/app/core/types';
import { CommonModule } from '@angular/common';
import { PathParams } from '@core/router/path-params';
import { ButtonDirective } from '@ui/buttons/directives';
import { BackButtonComponent } from '@ui/buttons/components/back-button';
import { WeatherIconComponent } from '@ui/icons/weather-icon';

@Component({
  selector: 'app-forecasts-list',
  standalone: true,
  templateUrl: './forecasts-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    ButtonDirective,
    BackButtonComponent,
    WeatherIconComponent,
  ],
})
export class ForecastsListComponent {
  protected zipcode?: ZipCode;
  private forecastSignal = signal<Forecast | null>(null);

  public get forecast(): Signal<Forecast | null> {
    return this.forecastSignal.asReadonly();
  }

  public constructor(
    protected weatherService: WeatherService,
    private route: ActivatedRoute
  ) {
    route.params.subscribe(params => {
      this.zipcode = params[PathParams.ZIPCODE];

      weatherService
        .getForecast(this.zipcode!)
        .subscribe(data => this.forecastSignal.set(data));
    });
  }
}
