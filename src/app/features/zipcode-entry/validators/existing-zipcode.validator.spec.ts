import { ExistingZipcodeValidator } from '@features/zipcode-entry/validators/existing-zipcode.validator';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { WeatherApiService } from '@core/api/weather-api.service';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { CurrentConditionsFactory } from '@testing/factories';
import {
  AsyncValidatorFn,
  FormControl,
  ValidationErrors,
} from '@angular/forms';
import { CurrentConditions, ZipCode } from '@core/types';
import { HttpErrorResponse } from '@angular/common/http';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('ExistingZipcodeValidator', () => {
  let service: ExistingZipcodeValidator;
  let api: SpyObj<WeatherApiService>;
  let control: FormControl<ZipCode | null | undefined>;

  const currentConditions: CurrentConditions =
    CurrentConditionsFactory.createInstance();

  beforeEach((): void => {
    api = createSpyObj<WeatherApiService>(['getCurrentConditions']);
    api.getCurrentConditions.and.returnValue(of(currentConditions));

    control = new FormControl(undefined);

    TestBed.configureTestingModule({
      providers: [{ provide: WeatherApiService, useValue: api }],
    });

    service = TestBed.inject(ExistingZipcodeValidator);
  });

  it('should create an instance', (): void => {
    expect(service).toBeTruthy();
  });

  it('should create async validator', (): void => {
    const validator: AsyncValidatorFn = service.createValidator();

    expect(validator).toBeTruthy();
    expect(validator).toBeInstanceOf(Function);
  });

  describe('Positive validation scenarios', (): void => {
    it('should pass validation', async () => {
      const validator = service.createValidator();
      control.setValue('10001');
      api.getCurrentConditions.and.returnValue(of(currentConditions));

      const result$ = validator(control) as Observable<ValidationErrors | null>;
      expect(result$).toBeInstanceOf(Observable);

      const validationResult = await firstValueFrom(result$);

      expect(validationResult).toBeNull();
      expect(api.getCurrentConditions).toHaveBeenCalledWith(control.value!);
    });

    it('should emit callbacks during validation', async () => {
      let locationLookupStartedCalled: boolean = false;
      let locationLookupFinished: boolean = false;

      const validator = service.createValidator({
        locationLookupStarted: () => (locationLookupStartedCalled = true),
        locationLookupFinished: () => (locationLookupFinished = true),
      });

      control.setValue('10001');
      api.getCurrentConditions.and.returnValue(of(currentConditions));

      const result$ = validator(control) as Observable<ValidationErrors | null>;
      expect(result$).toBeInstanceOf(Observable);

      const validationResult = await firstValueFrom(result$);

      expect(validationResult).toBeNull();
      expect(locationLookupStartedCalled).toBeTrue();
      expect(locationLookupFinished).toBeTrue();
    });

    it('should respect minimum time to resolve', fakeAsync(() => {
      const validator = service.createValidator({
        minimumTimeToResolveMillis: 500,
      });

      control.setValue('10001');
      api.getCurrentConditions.and.returnValue(of(currentConditions));

      const result$ = validator(control) as Observable<ValidationErrors | null>;
      expect(result$).toBeInstanceOf(Observable);

      let validationResult: ValidationErrors | null | undefined = undefined;

      result$.subscribe(result => (validationResult = result));

      expect(validationResult).toBeUndefined();

      tick(500);

      expect(validationResult).toBeNull();
    }));

    it('should skip validation for empty zipcode', async () => {
      const validator = service.createValidator();
      control.setValue('');
      api.getCurrentConditions.and.returnValue(of(currentConditions));

      const result$ = validator(control) as Observable<ValidationErrors | null>;
      expect(result$).toBeInstanceOf(Observable);

      const validationResult = await firstValueFrom(result$);

      expect(validationResult).toBeNull();
      expect(api.getCurrentConditions).not.toHaveBeenCalledWith(control.value!);
    });
  });

  describe('Negative validation scenarios', (): void => {
    it('should fail validation', async () => {
      const validator = service.createValidator();
      control.setValue('10001');
      api.getCurrentConditions.and.returnValue(
        throwError(() => {
          return new HttpErrorResponse({
            status: 500,
            error: 'Internal Server Error',
          });
        })
      );

      const result$ = validator(control) as Observable<ValidationErrors | null>;
      expect(result$).toBeInstanceOf(Observable);

      const validationResult = await firstValueFrom(result$);

      expect(validationResult).toBeTruthy();
      expect(
        validationResult![ExistingZipcodeValidator.ERROR_CODE]
      ).toBeTruthy();
      expect(validationResult![ExistingZipcodeValidator.ERROR_CODE]).toEqual({
        zipcode: '10001',
        message: ExistingZipcodeValidator.ERROR_MESSAGE,
      });
      expect(api.getCurrentConditions).toHaveBeenCalledWith(control.value!);
    });

    it('should respect minimum time to resolve', fakeAsync(() => {
      const validator = service.createValidator({
        minimumTimeToResolveMillis: 500,
      });

      control.setValue('10001');

      api.getCurrentConditions.and.returnValue(
        throwError(() => {
          return new HttpErrorResponse({
            status: 500,
            error: 'Internal Server Error',
          });
        })
      );

      const result$ = validator(control) as Observable<ValidationErrors | null>;
      expect(result$).toBeInstanceOf(Observable);

      let validationResult: ValidationErrors | null | undefined = undefined;
      result$.subscribe(result => (validationResult = result));

      expect(api.getCurrentConditions).toHaveBeenCalledWith(control.value!);
      expect(validationResult).toBeUndefined();

      tick(500);

      expect(validationResult).toBeTruthy();
    }));
  });
});
