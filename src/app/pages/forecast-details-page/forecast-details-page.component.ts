import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResolvedLocationForecast } from '@features/data-access/resolvers';
import { BackButtonComponent } from '@ui/buttons/components/back-button';
import { ForecastsListComponent } from '@features/forecasts-list';

@Component({
  selector: 'app-forecast-details-page',
  standalone: true,
  imports: [CommonModule, BackButtonComponent, ForecastsListComponent],
  templateUrl: './forecast-details-page.component.html',
  styleUrl: './forecast-details-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForecastDetailsPageComponent {
  @Input({ required: true }) data!: ResolvedLocationForecast;
}
