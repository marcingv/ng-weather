import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
  signal,
} from '@angular/core';
import { LocationService } from '@features/data-access/services';
import { ButtonDirective } from '@ui/buttons/directives';
import {
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FirstErrorMessagePipe, FormControlDirective } from '@ui/forms';
import {
  ExistingZipcodeValidator,
  UniqueZipcodeValidator,
  UsZipcodeValidator,
} from './validators';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { IconLoadingComponent } from '@ui/icons/icon-loading';
import { ZipcodeAndCity } from '@features/data-access/types';

@Component({
  selector: 'app-zipcode-entry',
  standalone: true,
  templateUrl: './zipcode-entry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ButtonDirective,
    ReactiveFormsModule,
    FormControlDirective,
    IconLoadingComponent,
    FirstErrorMessagePipe,
  ],
})
export class ZipcodeEntryComponent {
  private readonly service = inject(LocationService);
  private readonly existingZipCodeValidator = inject(ExistingZipcodeValidator);
  private readonly locationLookupPendingSignal = signal<boolean>(false);

  protected formGroup = new FormGroup({
    zipcode: new FormControl<string>(
      '',
      [
        UsZipcodeValidator.isValid,
        UniqueZipcodeValidator.isUnique(this.service.userLocations),
      ],
      [this.configureZipcodeLookupValidator()]
    ),
    city: new FormControl<string>('', [Validators.required]),
  });

  private zipcodeEvents = toSignal(this.formGroup.controls.zipcode.events);
  protected zipcodeErrors = computed(() => {
    return this.zipcodeEvents()?.source.errors;
  });

  public constructor() {
    this.resetCityControlOnZipcodeChange();
  }

  public resetForm(): void {
    this.formGroup.reset();
  }

  protected get locationLookupPending(): Signal<boolean> {
    return this.locationLookupPendingSignal.asReadonly();
  }

  protected onSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }

    this.addLocation({
      zipcode: this.formGroup.controls.zipcode.value!,
      city: this.formGroup.controls.city.value!,
    });
    this.resetForm();
  }

  private addLocation(location: ZipcodeAndCity): void {
    this.service.addLocation(location);
  }

  private configureZipcodeLookupValidator(): AsyncValidatorFn {
    return this.existingZipCodeValidator.createValidator({
      locationLookupStarted: () => this.locationLookupPendingSignal.set(true),
      locationLookupFinished: (location: Partial<ZipcodeAndCity>): void => {
        this.locationLookupPendingSignal.set(false);
        if (location.city) {
          this.formGroup.controls.city.setValue(location.city);
        }
      },
    });
  }

  private resetCityControlOnZipcodeChange(): void {
    this.formGroup.controls.zipcode.valueChanges
      .pipe(
        tap(() => this.formGroup.controls.city.reset()),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
