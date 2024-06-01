import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LocationService } from '@features/data-access/services';
import { ButtonDirective } from '@ui/buttons/directives';
import { ZipCode } from '@core/types';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormControlDirective } from '@ui/forms/directives/form-control.directive';
import { UsZipcodeValidator } from '@features/zipcode-entry/validators/us-zipcode.validator';

@Component({
  selector: 'app-zipcode-entry',
  standalone: true,
  templateUrl: './zipcode-entry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonDirective, ReactiveFormsModule, FormControlDirective],
})
export class ZipcodeEntryComponent {
  private service: LocationService = inject(LocationService);

  protected formGroup = new FormGroup({
    zipcode: new FormControl<string>('', [UsZipcodeValidator.isValid]),
  });

  public resetForm(): void {
    this.formGroup.reset();
  }

  protected onSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }

    this.addLocation(this.formGroup.controls.zipcode.value!);
    this.resetForm();
  }

  private addLocation(zipcode: ZipCode): void {
    this.service.addLocation(zipcode);
  }
}
