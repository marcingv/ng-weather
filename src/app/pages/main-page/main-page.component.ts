import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  model,
  Signal,
} from '@angular/core';
import { ZipcodeEntryComponent } from '@features/zipcode-entry';
import { CurrentConditionsComponent } from '@features/current-conditions';
import { LocationService } from '@features/data-access/services';
import { ZipCode } from '@core/types';
import { EmptyCollectionPlaceholderComponent } from '@ui/placeholders/empty-collection-placeholder';
import {
  TabComponent,
  TabLabelTemplateDirective,
  TabLazyContentTemplateDirective,
  TabsViewComponent,
} from '@ui/tabs';
import {
  WeatherConditionsPreloadingStrategy,
  ZipcodeAndCity,
} from '@features/data-access/types';
import { Router } from '@angular/router';
import { Paths } from '@core/router/paths';
import { ToastsService } from '@ui/toasts/services/toasts.service';
import { ENVIRONMENT } from '@environments/environment';

@Component({
  selector: 'app-main-page',
  standalone: true,
  templateUrl: './main-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZipcodeEntryComponent,
    CurrentConditionsComponent,
    EmptyCollectionPlaceholderComponent,
    TabsViewComponent,
    TabComponent,
    TabLabelTemplateDirective,
    TabLazyContentTemplateDirective,
  ],
})
export class MainPageComponent {
  private readonly PRELOADING_STRATEGY: WeatherConditionsPreloadingStrategy =
    ENVIRONMENT.WEATHER_CONDITIONS_PRELOADING_STRATEGY;

  protected readonly LAZY_LOADED_TABS: boolean =
    this.PRELOADING_STRATEGY === 'on-demand-data-fetching';

  private readonly router: Router = inject(Router);
  private readonly locationsService: LocationService = inject(LocationService);
  private readonly toastsService: ToastsService | null = inject(ToastsService, {
    optional: true,
  });

  protected zipcode = model<ZipCode | undefined>(undefined);

  protected readonly userLocations: Signal<ZipcodeAndCity[]> =
    this.locationsService.userLocations;

  public constructor() {
    effect((): void => {
      if (this.zipcode()) {
        this.router.navigate([Paths.ROOT, this.zipcode()]);
      } else {
        this.router.navigate([Paths.ROOT]);
      }
    });
  }

  public removeLocation(zipcode: ZipCode): void {
    this.locationsService.removeLocation(zipcode);
  }

  public onTabRemoved(zipcode: ZipCode): void {
    this.removeLocation(zipcode);
  }

  public onLocationSubmitted(location: ZipcodeAndCity): void {
    this.zipcode.set(location.zipcode);

    if (this.toastsService) {
      this.toastsService.show({
        severity: 'primary',
        message: `${location.city} (${location.zipcode}) - location has been added!`,
      });
    }
  }
}
