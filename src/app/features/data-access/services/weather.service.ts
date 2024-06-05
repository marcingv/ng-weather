import {
  computed,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
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

  public getConditions(zipcode: ZipCode): Signal<WeatherConditionsData> {
    if (!this.weatherData()[zipcode]) {
      this.loadCurrentConditions(zipcode).subscribe();
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

  private loadCurrentConditions(
    zipcode: ZipCode
  ): Observable<WeatherConditionsData> {
    return this.api.getCurrentConditions(zipcode).pipe(
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
      }),
      tap((data: WeatherConditionsData) => {
        this.weatherData.update((prevData: WeatherConditionsDictionary) => ({
          ...prevData,
          [zipcode]: data,
        }));
      })
    );
  }
}
