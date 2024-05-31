import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENVIRONMENT } from '@environments/environment';
import { Observable } from 'rxjs';
import { CurrentConditions, Forecast, ZipCode } from '@core/types';

@Injectable({
  providedIn: 'root',
})
export class WeatherApiService {
  private readonly API_URL = ENVIRONMENT.OPEN_WEATHER.API_URL;
  private readonly APP_ID = ENVIRONMENT.OPEN_WEATHER.APP_ID;
  private readonly ENDPOINTS = {
    WEATHER: 'weather',
    FORECAST_DAILY: 'forecast/daily',
  };
  private readonly DEFAULT_UNITS = 'imperial';

  private http: HttpClient = inject(HttpClient);

  public getCurrentConditions(zipcode: ZipCode): Observable<CurrentConditions> {
    const url = this.prepareEndpointUrl(this.ENDPOINTS.WEATHER, {
      zip: `${zipcode},us`,
      units: this.DEFAULT_UNITS,
    });

    return this.http.get<CurrentConditions>(url);
  }

  public getDailyForecast(
    zipcode: ZipCode,
    daysCount: number = ENVIRONMENT.DAILY_FORECAST_DAYS
  ): Observable<Forecast> {
    const url = this.prepareEndpointUrl(this.ENDPOINTS.FORECAST_DAILY, {
      zip: `${zipcode},us`,
      units: this.DEFAULT_UNITS,
      cnt: daysCount.toString(),
    });

    return this.http.get<Forecast>(url);
  }

  private prepareEndpointUrl(
    endpoint: string,
    queryParams?: Record<string, string>
  ): string {
    const params = new URLSearchParams(queryParams);
    params.set('APPID', this.APP_ID);

    const url = new URL(`${this.API_URL}/${endpoint}?${params.toString()}`);

    return url.toString();
  }
}
