import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { ResolvedLocationForecast } from '@features/data-access/resolvers/types/resolved-location-forecast';
import { catchError, map, Observable, of } from 'rxjs';
import { WeatherApiService } from '@core/api/weather-api.service';
import { inject } from '@angular/core';
import { PathParams } from '@core/router/path-params';
import { Forecast, ZipCode } from '@core/types';
import { HttpErrorResponse } from '@angular/common/http';
import { ENVIRONMENT } from '@environments/environment';

const NOT_FOUND_MESSAGE = 'Location with specified Zip Code does not exist.';
const FETCH_ERROR_MESSAGE =
  "Could not fetch location's forecast. Try again later.";

export const locationForecastResolver: (
  numOfDays?: number
) => ResolveFn<Observable<ResolvedLocationForecast>> = (
  numOfDays: number = ENVIRONMENT.DAILY_FORECAST_DAYS
) => {
  return (
    route: ActivatedRouteSnapshot
  ): Observable<ResolvedLocationForecast> => {
    const api: WeatherApiService = inject(WeatherApiService);
    const zipcode: ZipCode | null = route.paramMap.get(PathParams.ZIPCODE);

    if (!zipcode) {
      return of({
        zipcode: '',
        forecast: null,
        isResolveError: true,
        resolveErrorMessage: NOT_FOUND_MESSAGE,
      });
    }

    return api.getDailyForecast(zipcode, numOfDays).pipe(
      map((forecast: Forecast): ResolvedLocationForecast => {
        return {
          zipcode: zipcode,
          forecast: forecast,
          isResolveError: false,
        };
      }),
      catchError(
        (err: HttpErrorResponse): Observable<ResolvedLocationForecast> => {
          return of({
            zipcode: zipcode,
            forecast: null,
            isResolveError: true,
            resolveErrorMessage:
              err.status === 404 ? NOT_FOUND_MESSAGE : FETCH_ERROR_MESSAGE,
          });
        }
      )
    );
  };
};
