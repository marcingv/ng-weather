import { TestBed } from '@angular/core/testing';
import { WeatherService } from './weather.service';
import { WeatherApiService } from '@core/api/weather-api.service';
import { of, throwError } from 'rxjs';
import { CurrentConditionsFactory, ForecastFactory } from '@testing/factories';
import { WeatherConditionsData } from '@features/data-access/types';
import { Signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('WeatherService', () => {
  let service: WeatherService;
  let api: SpyObj<WeatherApiService>;

  beforeEach(() => {
    api = createSpyObj<WeatherApiService>([
      'getCurrentConditions',
      'getDailyForecast',
    ]);
    api.getCurrentConditions.and.returnValue(
      of(CurrentConditionsFactory.createInstance())
    );
    api.getDailyForecast.and.returnValue(of(ForecastFactory.createInstance()));

    TestBed.configureTestingModule({
      providers: [{ provide: WeatherApiService, useValue: api }],
    });

    service = TestBed.inject(WeatherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Current Conditions', () => {
    it('should return signal with successfully resolved weather conditions', () => {
      const dataSignal: Signal<WeatherConditionsData> =
        service.getConditions('10001');

      const data: WeatherConditionsData = dataSignal();

      expect(data).toBeTruthy();
      expect(data.zipcode).toEqual('10001');
      expect(data.isLoading).toBeFalsy();
      expect(data.isLoadError).toBeFalsy();
      expect(data.errorMessage).toBeFalsy();
      expect(data.data).toBeTruthy();
      expect(data.fetchTimestamp).toBeTruthy();
    });

    it('should return data describing api error', () => {
      api.getCurrentConditions.and.returnValue(
        throwError(
          () => new HttpErrorResponse({ status: 500, error: 'An error' })
        )
      );

      const dataSignal: Signal<WeatherConditionsData> =
        service.getConditions('10001');

      const data: WeatherConditionsData = dataSignal();

      expect(data).toBeTruthy();
      expect(data.zipcode).toEqual('10001');
      expect(data.isLoading).toBeFalsy();
      expect(data.isLoadError).toBeTrue();
      expect(data.errorMessage).toBeTruthy();
      expect(data.data).toBeUndefined();
      expect(data.fetchTimestamp).toBeTruthy();
    });

    it('should refresh conditions', () => {
      const dataSignal: Signal<WeatherConditionsData> =
        service.getConditions('10001');

      const dataBefore: WeatherConditionsData = dataSignal();

      service.refreshConditions('10001');
      expect(api.getCurrentConditions).toHaveBeenCalledWith(dataBefore.zipcode);

      const dataAfter: WeatherConditionsData = dataSignal();

      expect(dataBefore.zipcode).toEqual(dataAfter.zipcode);
      expect(dataBefore).not.toBe(dataAfter);
    });
  });
});
