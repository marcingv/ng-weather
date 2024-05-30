import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import {
  LocationService,
  WeatherService,
} from '@features/data-access-forecasts/services';
import { Router, RouterLink } from '@angular/router';
import { ConditionsAndZip } from 'src/app/core/types';
import { CommonModule } from '@angular/common';
import { Paths } from '@core/router/paths';

@Component({
  selector: 'app-current-conditions',
  standalone: true,
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
})
export class CurrentConditionsComponent {
  protected readonly Paths = Paths;

  protected weatherService = inject(WeatherService);
  private router = inject(Router);
  protected locationService = inject(LocationService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> =
    this.weatherService.getCurrentConditions();

  showForecast(zipcode: string) {
    this.router.navigate([Paths.ROOT, Paths.FORECAST, zipcode]);
  }
}
