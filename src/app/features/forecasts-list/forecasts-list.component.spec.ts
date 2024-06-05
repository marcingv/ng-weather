import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForecastFactory } from '@testing/factories';
import { Forecast } from '@core/types';
import { ForecastsListComponent } from '@features/forecasts-list/forecasts-list.component';

describe('ForecastsListComponent', () => {
  let component: ForecastsListComponent;
  let fixture: ComponentFixture<ForecastsListComponent>;

  const forecast: Forecast = ForecastFactory.createInstance();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForecastsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ForecastsListComponent);
    component = fixture.componentInstance;
    component.forecast = forecast;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
