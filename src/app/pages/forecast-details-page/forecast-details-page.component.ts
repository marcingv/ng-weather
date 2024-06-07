import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BackButtonComponent,
  CustomGoBackNavigationLink,
} from '@ui/buttons/components/back-button';
import { ForecastsListComponent } from '@features/forecasts-list';
import { ErrorPlaceholderComponent } from '@ui/placeholders/error-placeholder';
import { ResolvedLocationForecast } from '@features/data-access/types';
import { Paths } from '@core/router/paths';

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
export class ForecastDetailsPageComponent implements OnChanges {
  @Input({ required: true }) data!: ResolvedLocationForecast;

  public fallbackBackUrl?: CustomGoBackNavigationLink;

  public ngOnChanges(): void {
    this.fallbackBackUrl = [Paths.ROOT, Paths.WEATHER, this.data.zipcode];
  }
}
