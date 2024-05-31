import {
  computed,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  ConditionsAndZip,
  CurrentConditions,
  Forecast,
  ZipCode,
} from '@core/types';
import { WeatherApiService } from '@core/api/weather-api.service';
import { WeatherConditionsDictionary } from '@core/types/weather-conditions-dictionary';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly api: WeatherApiService = inject(WeatherApiService);

  private readonly weatherData: WritableSignal<WeatherConditionsDictionary> =
    signal<WeatherConditionsDictionary>({});

  public getConditions(zipcode: ZipCode): Signal<ConditionsAndZip | null> {
    if (!this.weatherData()[zipcode]) {
      this.loadCurrentConditions(zipcode).subscribe();
    }

    return computed(() => {
      return this.weatherData()[zipcode] ?? null;
    });
  }

  private loadCurrentConditions(
    zipcode: ZipCode
  ): Observable<CurrentConditions> {
    return this.api.getCurrentConditions(zipcode).pipe(
      tap((data: CurrentConditions) => {
        this.weatherData.update((prevData: WeatherConditionsDictionary) => {
          return {
            ...prevData,
            [zipcode]: {
              zip: zipcode,
              data: data,
            },
          };
        });
      })
    );
  }

  public getForecast(zipcode: ZipCode): Observable<Forecast> {
    return this.api.getDailyForecast(zipcode, 5);
  }
}
