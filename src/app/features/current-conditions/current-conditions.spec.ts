import { WeatherService } from '@features/data-access/services';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrentConditionsFactory } from '@testing/factories';
import { provideRouter } from '@angular/router';
import { CurrentConditionsComponent } from './current-conditions.component';
import { ZipCode } from '@core/types';
import { signal } from '@angular/core';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('CurrentConditionsComponent', (): void => {
  let weatherServiceSpy: SpyObj<WeatherService>;

  let component: CurrentConditionsComponent;
  let fixture: ComponentFixture<CurrentConditionsComponent>;

  const ZIPCODE: ZipCode = '10001';

  beforeEach(async () => {
    weatherServiceSpy = createSpyObj<WeatherService>([
      'getConditions',
      'refreshConditions',
    ]);
    weatherServiceSpy.getConditions.and.callFake((zipcode: ZipCode) => {
      return signal({
        zipcode: zipcode,
        data: CurrentConditionsFactory.createInstance(),
        isLoading: false,
        isLoadError: false,
        errorMessage: undefined,
        fetchTimestamp: Date.now(),
      });
    });

    await TestBed.configureTestingModule({
      imports: [CurrentConditionsComponent],
      providers: [
        provideRouter([]),
        { provide: WeatherService, useValue: weatherServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrentConditionsComponent);
    component = fixture.componentInstance;
    component.zipcode = ZIPCODE;
    component.ngOnChanges();
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should get conditions during creation', (): void => {
    expect(weatherServiceSpy.getConditions).toHaveBeenCalledWith(ZIPCODE);
  });
});
