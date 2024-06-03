import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import {
  catchError,
  first,
  map,
  Observable,
  of,
  ReplaySubject,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { WeatherApiService } from '@core/api/weather-api.service';
import { CurrentConditions, ZipCode } from '@core/types';
import { ZipcodeAndCity } from '@features/data-access/types';

@Injectable({ providedIn: 'root' })
export class ExistingZipcodeValidator {
  public static ERROR_CODE: string = 'zipcodeDoesNotExist';
  public static ERROR_MESSAGE: string = 'Provided zipcode does not exist.';

  private readonly api: WeatherApiService = inject(WeatherApiService);

  public createValidator(options?: {
    locationLookupStarted?: () => void;
    locationLookupFinished?: (location: Partial<ZipcodeAndCity>) => void;
  }): AsyncValidatorFn {
    const validateRequests$: Subject<ZipCode> = new ReplaySubject<ZipCode>(1);
    const location$: Observable<ZipcodeAndCity> = validateRequests$.pipe(
      switchMap((zipcode: ZipCode) => {
        return this.api.getCurrentConditions(zipcode).pipe(
          map(
            (data: CurrentConditions): ZipcodeAndCity => ({
              zipcode: zipcode,
              city: data.name,
            })
          )
        );
      })
    );

    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const value = control.value;
      if (!value || !value.length) {
        return of(null);
      }

      if (options && options.locationLookupStarted) {
        options.locationLookupStarted();
      }

      validateRequests$.next(value);

      const locationLookupResult: Partial<ZipcodeAndCity> = { zipcode: value };

      return location$.pipe(
        first(),
        tap({
          next: (data: ZipcodeAndCity): void => {
            locationLookupResult.city = data.city;
          },
          finalize: (): void => {
            if (options && options.locationLookupFinished) {
              options.locationLookupFinished(locationLookupResult);
            }
          },
        }),
        map((data: ZipcodeAndCity) => {
          const isError: boolean = !data;
          if (isError) {
            return this.buildError(value);
          }

          return null;
        }),
        catchError(() => {
          return of(this.buildError(value));
        })
      );
    };
  }

  private buildError(zipcode: ZipCode) {
    return {
      [ExistingZipcodeValidator.ERROR_CODE]: {
        zipcode: zipcode,
        message: ExistingZipcodeValidator.ERROR_MESSAGE,
      },
    };
  }
}
