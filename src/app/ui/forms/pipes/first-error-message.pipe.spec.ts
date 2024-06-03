import { FirstErrorMessagePipe } from './first-error-message.pipe';

describe('FirstErrorMessagePipe', (): void => {
  let pipe: FirstErrorMessagePipe;

  beforeEach((): void => {
    pipe = new FirstErrorMessagePipe();
  });

  it('create an instance', (): void => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string when errors object is empty', (): void => {
    expect(pipe.transform({})).toEqual('');
  });

  it('should return built-in message for known error codes', (): void => {
    expect(pipe.transform({ required: true })).toEqual(
      FirstErrorMessagePipe.COMMON_ERROR_MESSAGES.required
    );
  });

  it('should return message provided in error object event for built-in error codes', (): void => {
    expect(
      pipe.transform({ required: { message: 'This is my custom message.' } })
    ).toEqual('This is my custom message.');
  });

  it('should return declared message for custom error codes', (): void => {
    expect(
      pipe.transform({
        myCustomErrorCode: { message: 'This is my custom message.' },
      })
    ).toEqual('This is my custom message.');
  });

  it('should return error code for custom errors without message declaration', (): void => {
    expect(
      pipe.transform({
        myCustomErrorCode: true,
      })
    ).toEqual('myCustomErrorCode');
  });
});
