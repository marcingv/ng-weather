import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  signal,
} from '@angular/core';
import { WeatherService } from '@features/data-access-forecasts/services';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Forecast } from 'src/app/core/types';
import { CommonModule } from '@angular/common';
import { PathParams } from '@core/router/path-params';
import { Paths } from '@core/router/paths';

@Component({
  selector: 'app-forecasts-list',
  standalone: true,
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
})
export class ForecastsListComponent {
  protected zipcode?: string;
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

  protected readonly Paths = Paths;
}
