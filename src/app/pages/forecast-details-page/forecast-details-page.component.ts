import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResolvedLocationForecast } from '@features/data-access/resolvers';
import { BackButtonComponent } from '@ui/buttons/components/back-button';
import { ForecastsListComponent } from '@features/forecasts-list';
import { ErrorPlaceholderComponent } from '@ui/placeholders/error-placeholder';

@Component({
  selector: 'app-forecast-details-page',
  standalone: true,
  imports: [
    CommonModule,
    BackButtonComponent,
    ForecastsListComponent,
    ErrorPlaceholderComponent,
  ],
  templateUrl: './forecast-details-page.component.html',
  styleUrl: './forecast-details-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForecastDetailsPageComponent {
  @Input({ required: true }) data!: ResolvedLocationForecast;
}
