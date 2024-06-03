import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Pipe({
  name: 'firstErrorMessage',
  standalone: true,
})
export class FirstErrorMessagePipe implements PipeTransform {
  public static readonly COMMON_ERROR_MESSAGES: {
    required: string;
    [code: string]: string;
  } = {
    required: 'Value is required.',
  };

  public transform(errors: ValidationErrors): string {
    const errorCodes: string[] = Object.keys(errors);
    if (!errorCodes.length) {
      return '';
    }

    const errorCode: string = errorCodes[0];
    const errorObj: boolean | { [code: string]: unknown } = errors[errorCode];

    let message: string | undefined;
    if (
      errorObj instanceof Object &&
      'message' in errorObj &&
      typeof errorObj['message'] === 'string'
    ) {
      message = errorObj['message'];
    }

    if (!message) {
      if (FirstErrorMessagePipe.COMMON_ERROR_MESSAGES[errorCode]) {
        message = FirstErrorMessagePipe.COMMON_ERROR_MESSAGES[errorCode];
      } else {
        message = errorCode;
      }
    }

    return message;
  }
}
