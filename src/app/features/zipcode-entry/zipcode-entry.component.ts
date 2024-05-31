import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LocationService } from '@features/data-access-forecasts/services';
import { ButtonDirective } from '@ui/buttons/directives';
import { ZipCode } from '@core/types';

@Component({
  selector: 'app-zipcode-entry',
  standalone: true,
  templateUrl: './zipcode-entry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonDirective],
})
export class ZipcodeEntryComponent {
  private service: LocationService = inject(LocationService);

  public addLocation(zipcode: ZipCode): void {
    this.service.addLocation(zipcode);
  }
}
