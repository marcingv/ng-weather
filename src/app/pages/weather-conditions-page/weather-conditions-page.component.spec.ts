import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherConditionsPageComponent } from '@pages/weather-conditions-page/weather-conditions-page.component';
import { provideRouter } from '@angular/router';
import { LocationService } from '@features/data-access/services';
import { ToastsService } from '@ui/toasts';
import { ZipcodeAndCity } from '@features/data-access/types';
import { of } from 'rxjs';
import { CurrentConditionsFactory } from '@testing/factories';
import { LocalStorageCacheService } from '@core/cache/services';
import { InMemoryStorageService } from '@testing/storage';
import { WeatherApiService } from '@core/api/weather-api.service';
import { TabComponent, TabsViewComponent } from '@ui/tabs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('WeatherConditionsPageComponent', () => {
  let locationsSpy: SpyObj<LocationService>;
  let weatherApiSpy: SpyObj<WeatherApiService>;
  let toastsService: SpyObj<ToastsService>;

  let component: WeatherConditionsPageComponent;
  let fixture: ComponentFixture<WeatherConditionsPageComponent>;

  const KNOWN_LOCATIONS: ZipcodeAndCity[] = [
    { zipcode: '10001', city: 'New York' },
    { zipcode: '95742', city: 'Rancho Cordova' },
  ];

  beforeEach(async () => {
    locationsSpy = createSpyObj<LocationService>([
      'userLocations',
      'addLocation',
      'removeLocation',
    ]);
    locationsSpy.userLocations.and.returnValue(KNOWN_LOCATIONS);

    weatherApiSpy = createSpyObj<WeatherApiService>(['getCurrentConditions']);
    weatherApiSpy.getCurrentConditions.and.returnValue(
      of(CurrentConditionsFactory.createInstance())
    );

    toastsService = createSpyObj<ToastsService>(['show']);

    await TestBed.configureTestingModule({
      imports: [WeatherConditionsPageComponent],
      providers: [
        provideRouter([]),
        { provide: LocationService, useValue: locationsSpy },
        { provide: WeatherApiService, useValue: weatherApiSpy },
        { provide: LocalStorageCacheService, useClass: InMemoryStorageService },
        { provide: ToastsService, useValue: toastsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherConditionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should display tabs with weather conditions', (): void => {
    const tabsView: DebugElement = fixture.debugElement.query(
      By.directive(TabsViewComponent)
    );
    expect(tabsView).toBeTruthy();

    const tabs: DebugElement[] = tabsView.queryAll(By.directive(TabComponent));
    expect(tabs).toBeTruthy();
    expect(tabs.length).toEqual(KNOWN_LOCATIONS.length);
  });
});
