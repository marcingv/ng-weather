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

  private static ICON_URL = '/assets/weather/';

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

  public getWeatherIcon(id: number): string {
    if (id >= 200 && id <= 232) {
      return WeatherService.ICON_URL + 'art_storm.png';
    } else if (id >= 501 && id <= 511) {
      return WeatherService.ICON_URL + 'art_rain.png';
    } else if (id === 500 || (id >= 520 && id <= 531)) {
      return WeatherService.ICON_URL + 'art_light_rain.png';
    } else if (id >= 600 && id <= 622) {
      return WeatherService.ICON_URL + 'art_snow.png';
    } else if (id >= 801 && id <= 804) {
      return WeatherService.ICON_URL + 'art_clouds.png';
    } else if (id === 741 || id === 761) {
      return WeatherService.ICON_URL + 'art_fog.png';
    } else {
      return WeatherService.ICON_URL + 'art_clear.png';
    }
  }
}
