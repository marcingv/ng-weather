import { ZipCode } from '@core/types';
import { FormControl, ValidationErrors } from '@angular/forms';
import { UsZipcodeValidator } from './us-zipcode.validator';

describe('UsZipcodeValidator', (): void => {
  const control = new FormControl<string | null | undefined>(null);

  const validZipcodes: ZipCode[] = [
    '10001',
    '33030',
    '39180',
    '37055',
    '60411',
    '11717',
  ];

  const invalidZipcodes: ZipCode[] = [
    ' 10001',
    '10001 ',
    'ABCDE',
    '100 01',
    '100-01',
  ];

  it('should not fail fail validation for empty values', (): void => {
    control.setValue(null);
    expect(UsZipcodeValidator.isValid(control)).toBeNull();

    control.setValue(undefined);
    expect(UsZipcodeValidator.isValid(control)).toBeNull();

    control.setValue('');
    expect(UsZipcodeValidator.isValid(control)).toBeNull();
  });

  it('should return error object when validation failed', (): void => {
    control.setValue(invalidZipcodes[0]);

    const errors: ValidationErrors | null = UsZipcodeValidator.isValid(control);
    expect(errors).not.toBeNull();
    expect(Object.hasOwn(errors!, UsZipcodeValidator.ERROR_CODE)).toBeTrue();
    expect(errors![UsZipcodeValidator.ERROR_CODE]).toEqual({
      zipcode: invalidZipcodes[0],
      message: UsZipcodeValidator.ERROR_MESSAGE,
    });
  });

  validZipcodes.forEach((oneValidZipcode: ZipCode): void => {
    it(`should be valid zipcode: "${oneValidZipcode}"`, (): void => {
      control.setValue(oneValidZipcode);
      expect(UsZipcodeValidator.isValid(control)).toBeNull();
    });
  });

  invalidZipcodes.forEach((oneInvalidZipcode: ZipCode): void => {
    it(`should be invalid zipcode: "${oneInvalidZipcode}"`, (): void => {
      control.setValue(oneInvalidZipcode);
      expect(UsZipcodeValidator.isValid(control)).toBeTruthy();
    });
  });
});
