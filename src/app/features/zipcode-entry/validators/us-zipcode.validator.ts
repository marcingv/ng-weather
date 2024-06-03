import { AbstractControl, ValidationErrors } from '@angular/forms';

export class UsZipcodeValidator {
  public static readonly ERROR_CODE = 'zipcode';
  public static readonly ERROR_MESSAGE = 'This is not a valid zipcode.';

  private static readonly REGEX = /^[0-9]{5}$/ms;

  public static isValid(
    control: AbstractControl<string | null | undefined>
  ): ValidationErrors | null {
    const value = control.value;
    if (!value || !value.length) {
      return null;
    }

    const isError: boolean = !UsZipcodeValidator.REGEX.test(value);
    if (isError) {
      return {
        [UsZipcodeValidator.ERROR_CODE]: {
          zipcode: value,
          message: UsZipcodeValidator.ERROR_MESSAGE,
        },
      };
    }

    return null;
  }
}
