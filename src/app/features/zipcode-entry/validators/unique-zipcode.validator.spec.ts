import { FormControl, ValidationErrors } from '@angular/forms';
import { signal } from '@angular/core';
import { ZipCode } from '@core/types';
import { UniqueZipcodeValidator } from '@features/zipcode-entry/validators/unique-zipcode.validator';

describe('UniqueZipcodeValidator', (): void => {
  const control = new FormControl<string | null | undefined>(null);
  const usedZipcodes = signal<ZipCode[]>(['10001', '10002']);

  it('should fail validation when zipcode is already used', (): void => {
    control.setValue('10001');

    const errors: ValidationErrors | null =
      UniqueZipcodeValidator.isUnique(usedZipcodes)(control);

    expect(errors).not.toBeNull();
    expect(errors![UniqueZipcodeValidator.ERROR_CODE]).toBeTrue();
  });

  it('should pass validation when zipcode is unique', (): void => {
    control.setValue('10005');

    const errors: ValidationErrors | null =
      UniqueZipcodeValidator.isUnique(usedZipcodes)(control);

    expect(errors).toBeNull();
  });
});
