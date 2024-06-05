import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Weather } from '@core/types';
import { WeatherIconUrlPipe } from '@ui/icons/weather-icon/weather-icon-url.pipe';

@Component({
  selector: 'app-weather-icon',
  standalone: true,
  imports: [WeatherIconUrlPipe],
  templateUrl: './weather-icon.component.html',
  styleUrl: './weather-icon.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherIconComponent {
  @Input({ required: true }) public weather!: Weather;
  @Input() public cssClass?: string;
}
