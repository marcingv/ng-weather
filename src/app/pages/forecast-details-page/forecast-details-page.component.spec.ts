import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForecastDetailsPageComponent } from './forecast-details-page.component';
import { provideRouter } from '@angular/router';
import { ForecastFactory } from '@testing/factories';
import { Forecast, ZipCode } from '@core/types';
import { Paths } from '@core/router/paths';

describe('ForecastDetailsPageComponent', () => {
  let component: ForecastDetailsPageComponent;
  let fixture: ComponentFixture<ForecastDetailsPageComponent>;

  const zipcode: ZipCode = '10001';
  const forecast: Forecast = ForecastFactory.createInstance();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForecastDetailsPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ForecastDetailsPageComponent);
    component = fixture.componentInstance;
    component.data = {
      zipcode: zipcode,
      forecast: forecast,
      isResolveError: false,
    };
    component.ngOnChanges();
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should have fallback back button url set', () => {
    expect(component.fallbackBackUrl).toEqual([
      Paths.ROOT,
      Paths.WEATHER,
      zipcode,
    ]);
  });
});
