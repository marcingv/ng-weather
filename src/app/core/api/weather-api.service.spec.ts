import { TestBed } from '@angular/core/testing';
import { WeatherApiService } from './weather-api.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
  TestRequest,
} from '@angular/common/http/testing';
import { CurrentConditions, Forecast, ZipCode } from '@core/types';
import { ENVIRONMENT } from '@environments/environment';

describe('WeatherApiService', () => {
  let service: WeatherApiService;
  let httpTestingController: HttpTestingController;

  const zipcode: ZipCode = '10001';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(WeatherApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch current weather conditions', () => {
    const expectedRequestUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode}%2Cus&units=imperial&APPID=${ENVIRONMENT.OPEN_WEATHER.APP_ID}`;
    let fetchedData: CurrentConditions | undefined;

    service
      .getCurrentConditions(zipcode)
      .subscribe((response: CurrentConditions) => (fetchedData = response));

    const request: TestRequest =
      httpTestingController.expectOne(expectedRequestUrl);
    expect(request.request.method).toEqual('GET');

    request.flush({});
    httpTestingController.verify();

    expect(fetchedData).not.toBeUndefined();
  });

  it('should fetch forecast data', () => {
    const expectedRequestUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?zip=${zipcode}%2Cus&units=imperial&cnt=5&APPID=${ENVIRONMENT.OPEN_WEATHER.APP_ID}`;
    let fetchedData: Forecast | undefined;

    service
      .getDailyForecast(zipcode)
      .subscribe((response: Forecast) => (fetchedData = response));

    const request: TestRequest =
      httpTestingController.expectOne(expectedRequestUrl);
    expect(request.request.method).toEqual('GET');

    request.flush({});
    httpTestingController.verify();

    expect(fetchedData).not.toBeUndefined();
  });
});
