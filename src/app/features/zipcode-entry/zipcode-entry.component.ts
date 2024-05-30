import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LocationService } from '@features/data-access-forecasts/services';

@Component({
  selector: 'app-zipcode-entry',
  standalone: true,
  templateUrl: './zipcode-entry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZipcodeEntryComponent {
  private service: LocationService = inject(LocationService);

  public addLocation(zipcode: string): void {
    this.service.addLocation(zipcode);
  }
}
