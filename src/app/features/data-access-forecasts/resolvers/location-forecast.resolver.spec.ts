import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { locationForecastResolver } from './location-forecast.resolver';
import { Observable } from 'rxjs';
import { ResolvedLocationForecast } from '@features/data-access-forecasts/resolvers/types/resolved-location-forecast';

describe('locationForecastResolver', () => {
  const executeResolver: ResolveFn<Observable<ResolvedLocationForecast>> = (
    ...resolverParameters
  ) =>
    TestBed.runInInjectionContext(() =>
      locationForecastResolver()(...resolverParameters)
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
