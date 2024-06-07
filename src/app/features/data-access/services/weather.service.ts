import {
  computed,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  catchError,
  combineLatestWith,
  map,
  Observable,
  of,
  tap,
  timer,
} from 'rxjs';
import { CurrentConditions, ZipCode } from '@core/types';
import { WeatherApiService } from '@core/api/weather-api.service';
import {
  WeatherConditionsData,
  WeatherConditionsDictionary,
} from '@features/data-access/types';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly api: WeatherApiService = inject(WeatherApiService);

  private readonly weatherData: WritableSignal<WeatherConditionsDictionary> =
    signal<WeatherConditionsDictionary>({});

  public getConditions(
    zipcode: ZipCode,
    minResolveTimeMillis?: number
  ): Signal<WeatherConditionsData> {
    if (!this.weatherData()[zipcode]) {
      this.loadCurrentConditions(zipcode, minResolveTimeMillis).subscribe();
    }

    return computed(() => {
      const conditionsAndZip: WeatherConditionsData | null =
        this.weatherData()[zipcode];

      if (conditionsAndZip) {
        return conditionsAndZip;
      }

      // Notify is loading:
      return {
        zip: zipcode,
        isLoading: true,
      } satisfies WeatherConditionsData;
    });
  }

  public refreshConditions(zipcode: ZipCode): void {
    this.weatherData.update((prevData: WeatherConditionsDictionary) => {
      let conditions = prevData[zipcode];
      if (!conditions) {
        conditions = {
          zip: zipcode,
          isLoading: true,
        };
      } else {
        conditions = {
          ...conditions,
          isLoading: true,
          isLoadError: false,
          errorMessage: undefined,
        };
      }

      return {
        ...prevData,
        [zipcode]: conditions,
      };
    });

    this.loadCurrentConditions(zipcode).subscribe();
  }

  public loadCurrentConditions(
    zipcode: ZipCode,
    minResolveTimeMillis?: number
  ): Observable<WeatherConditionsData> {
    let data$: Observable<WeatherConditionsData> = this.api
      .getCurrentConditions(zipcode)
      .pipe(
        map(
          (data: CurrentConditions) =>
            ({
              zip: zipcode,
              data: data,
              fetchTimestamp: Date.now(),
            }) satisfies WeatherConditionsData
        ),
        catchError((error: HttpErrorResponse) => {
          return of({
            zip: zipcode,
            isLoadError: true,
            errorMessage: error.message,
            fetchTimestamp: Date.now(),
          } satisfies WeatherConditionsData);
        })
      );

    if (minResolveTimeMillis) {
      data$ = data$.pipe(
        combineLatestWith(timer(minResolveTimeMillis)),
        map(data => data[0])
      );
    }

    return data$.pipe(
      tap((data: WeatherConditionsData) => {
        this.weatherData.update((prevData: WeatherConditionsDictionary) => ({
          ...prevData,
          [zipcode]: data,
        }));
      })
    );
  }
}
