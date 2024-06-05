import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Forecast } from 'src/app/core/types';
import { CommonModule } from '@angular/common';
import { WeatherIconComponent } from '@ui/icons/weather-icon';

@Component({
  selector: 'app-forecasts-list',
  standalone: true,
  templateUrl: './forecasts-list.component.html',
  styleUrl: './forecasts-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, WeatherIconComponent],
})
export class ForecastsListComponent {
  @Input({ required: true }) public forecast!: Forecast;
}
