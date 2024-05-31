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
import { ConditionsAndZip, ZipCode } from 'src/app/core/types';
import { CommonModule } from '@angular/common';
import { Paths } from '@core/router/paths';
import { ButtonDirective } from '@ui/buttons/directives';

@Component({
  selector: 'app-current-conditions',
  standalone: true,
  templateUrl: './current-conditions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, ButtonDirective],
})
export class CurrentConditionsComponent {
  protected readonly Paths = Paths;

  private router = inject(Router);
  private locationService = inject(LocationService);
  protected weatherService = inject(WeatherService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> =
    this.weatherService.getCurrentConditions();

  public showForecast(zipcode: ZipCode): void {
    this.router.navigate([Paths.ROOT, Paths.FORECAST, zipcode]);
  }

  public onRemoveLocation($event: MouseEvent, zip: string): void {
    $event.preventDefault();
    $event.stopPropagation();

    this.locationService.removeLocation(zip);
  }
}
