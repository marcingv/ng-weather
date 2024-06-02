import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ZipCode } from '@core/types';
import { Signal } from '@angular/core';

export class UniqueZipcodeValidator {
  public static readonly ERROR_CODE = 'notUniqueZipcode';

  public static isUnique(usedZipcodes: Signal<ZipCode[]>): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value || !value.length) {
        return null;
      }

      const isError: boolean = usedZipcodes().includes(value);
      if (isError) {
        return { [UniqueZipcodeValidator.ERROR_CODE]: true };
      }

      return null;
    };
  }
}
