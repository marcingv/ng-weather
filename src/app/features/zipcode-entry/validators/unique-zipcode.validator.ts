import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Signal } from '@angular/core';
import { ZipcodeAndCity } from '@features/data-access/services';

export class UniqueZipcodeValidator {
  public static readonly ERROR_CODE = 'notUniqueZipcode';

  public static isUnique(usedZipcodes: Signal<ZipcodeAndCity[]>): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value || !value.length) {
        return null;
      }

      const isError: boolean = !!usedZipcodes().find(
        oneEntry => oneEntry.zipcode === value
      );
      if (isError) {
        return { [UniqueZipcodeValidator.ERROR_CODE]: true };
      }

      return null;
    };
  }
}
