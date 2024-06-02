import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import { ZipcodeEntryComponent } from '@features/zipcode-entry';
import { CurrentConditionsComponent } from '@features/current-conditions';
import { LocationService } from '@features/data-access/services';
import { ZipCode } from '@core/types';
import { Router } from '@angular/router';
import { Paths } from '@core/router/paths';
import { EmptyCollectionPlaceholderComponent } from '@ui/placeholders/empty-collection-placeholder';
import { TabComponent, TabsViewComponent } from '@ui/tabs';

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
  ],
})
export class MainPageComponent {
  private readonly router: Router = inject(Router);
  private readonly locationsService: LocationService = inject(LocationService);

  protected readonly userLocations: Signal<ZipCode[]> =
    this.locationsService.userLocations;

  public showForecast(zipcode: ZipCode): void {
    this.router.navigate([Paths.ROOT, Paths.FORECAST, zipcode]);
  }

  public removeLocation(zipcode: ZipCode): void {
    this.locationsService.removeLocation(zipcode);
  }

  public onTabRemoved(zipcode: ZipCode): void {
    this.removeLocation(zipcode);
  }
}
