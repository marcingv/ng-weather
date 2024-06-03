import { FormControl, ValidationErrors } from '@angular/forms';
import { signal } from '@angular/core';
import { UniqueZipcodeValidator } from './unique-zipcode.validator';
import { ZipcodeAndCity } from '@features/data-access/types';

describe('UniqueZipcodeValidator', (): void => {
  const control = new FormControl<string | null | undefined>(null);
  const usedZipcodes = signal<ZipcodeAndCity[]>([
    {
      zipcode: '10001',
      city: 'New York #1',
    },
    {
      zipcode: '10002',
      city: 'New York #2',
    },
  ]);

  it('should fail validation when zipcode is already used', (): void => {
    control.setValue('10001');

    const errors: ValidationErrors | null =
      UniqueZipcodeValidator.isUnique(usedZipcodes)(control);

    expect(errors).not.toBeNull();
    expect(errors![UniqueZipcodeValidator.ERROR_CODE]).toEqual({
      zipcode: '10001',
      message: UniqueZipcodeValidator.ERROR_MESSAGE,
    });
  });

  it('should pass validation when zipcode is unique', (): void => {
    control.setValue('10005');

    const errors: ValidationErrors | null =
      UniqueZipcodeValidator.isUnique(usedZipcodes)(control);

    expect(errors).toBeNull();
  });
});
