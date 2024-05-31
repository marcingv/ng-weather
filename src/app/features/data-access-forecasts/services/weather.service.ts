import { inject, Injectable, Signal, signal } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ConditionsAndZip,
  CurrentConditions,
  Forecast,
  ZipCode,
} from '@core/types';
import { WeatherApiService } from '@core/api/weather-api.service';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private api: WeatherApiService = inject(WeatherApiService);

  private static ICON_URL =
    'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  private currentConditions = signal<ConditionsAndZip[]>([]);

  addCurrentConditions(zipcode: ZipCode): void {
    this.api.getCurrentConditions(zipcode).subscribe({
      next: (data: CurrentConditions) =>
        this.currentConditions.update(conditions => [
          ...conditions,
          { zip: zipcode, data },
        ]),
    });
  }

  removeCurrentConditions(zipcode: ZipCode): void {
    this.currentConditions.update(conditions => {
      for (const i in conditions) {
        if (conditions[i].zip == zipcode) {
          conditions.splice(+i, 1);
        }
      }
      return conditions;
    });
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }

  getForecast(zipcode: ZipCode): Observable<Forecast> {
    return this.api.getDailyForecast(zipcode, 5);
  }

  getWeatherIcon(id: number): string {
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
