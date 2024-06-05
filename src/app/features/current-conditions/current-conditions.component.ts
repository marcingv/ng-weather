import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnChanges,
  Signal,
} from '@angular/core';
import { WeatherService } from '@features/data-access/services';
import { RouterLink } from '@angular/router';
import { ZipCode } from 'src/app/core/types';
import { CommonModule } from '@angular/common';
import { ButtonDirective } from '@ui/buttons/directives';
import { Paths } from '@core/router/paths';
import { WeatherIconComponent } from '@ui/icons/weather-icon';
import { ENVIRONMENT } from '@environments/environment';
import { WeatherConditionsData } from '@features/data-access/types';
import { ErrorPlaceholderComponent } from '@ui/placeholders/error-placeholder';

@Component({
  selector: 'app-current-conditions',
  standalone: true,
  templateUrl: './current-conditions.component.html',
  styleUrl: './current-conditions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    ButtonDirective,
    WeatherIconComponent,
    ErrorPlaceholderComponent,
  ],
})
export class CurrentConditionsComponent implements OnChanges {
  protected readonly FORECAST_DAYS: number = ENVIRONMENT.DAILY_FORECAST_DAYS;
  protected readonly Paths = Paths;
  protected readonly weatherService: WeatherService = inject(WeatherService);

  @Input({ required: true }) public zipcode!: ZipCode;

  public currentConditions!: Signal<WeatherConditionsData>;

  public ngOnChanges(): void {
    this.currentConditions = this.weatherService.getConditions(this.zipcode);
  }

  protected refreshConditions(): void {
    this.weatherService.refreshConditions(this.zipcode);
  }
}
