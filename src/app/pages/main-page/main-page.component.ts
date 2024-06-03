import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import { ZipcodeEntryComponent } from '@features/zipcode-entry';
import { CurrentConditionsComponent } from '@features/current-conditions';
import {
  LocationService,
  ZipcodeAndCity,
} from '@features/data-access/services';
import { ZipCode } from '@core/types';
import { EmptyCollectionPlaceholderComponent } from '@ui/placeholders/empty-collection-placeholder';
import {
  TabComponent,
  TabLabelTemplateDirective,
  TabsViewComponent,
} from '@ui/tabs';

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
  ],
})
export class MainPageComponent {
  private readonly locationsService: LocationService = inject(LocationService);

  protected readonly userLocations: Signal<ZipcodeAndCity[]> =
    this.locationsService.userLocations;

  public removeLocation(zipcode: ZipCode): void {
    this.locationsService.removeLocation(zipcode);
  }

  public onTabRemoved(zipcode: ZipCode): void {
    this.removeLocation(zipcode);
  }
}
