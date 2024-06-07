import { LocationService } from '@features/data-access/services';
import { WeatherApiService } from '@core/api/weather-api.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZipcodeAndCity } from '@features/data-access/types';
import { filter, first, firstValueFrom, map, of } from 'rxjs';
import { CurrentConditionsFactory } from '@testing/factories';
import { provideRouter } from '@angular/router';
import { LocalStorageCacheService } from '@core/cache/services';
import { InMemoryStorageService } from '@testing/storage';
import { ZipcodeEntryComponent } from './zipcode-entry.component';
import { By } from '@angular/platform-browser';
import { FormControlStatus } from '@angular/forms';
import { DebugElement } from '@angular/core';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('ZipcodeEntryComponent', () => {
  let locationsSpy: SpyObj<LocationService>;
  let weatherApiSpy: SpyObj<WeatherApiService>;

  let component: ZipcodeEntryComponent;
  let fixture: ComponentFixture<ZipcodeEntryComponent>;

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

    await TestBed.configureTestingModule({
      imports: [ZipcodeEntryComponent],
      providers: [
        provideRouter([]),
        { provide: LocationService, useValue: locationsSpy },
        { provide: WeatherApiService, useValue: weatherApiSpy },
        { provide: LocalStorageCacheService, useClass: InMemoryStorageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ZipcodeEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should submit valid zipcode and add new location', async () => {
    const submitBtn: DebugElement = fixture.debugElement.query(
      By.css('button')
    );
    expect(submitBtn).toBeTruthy();

    const form = component.formGroup;
    form.controls.zipcode.setValue('10003');

    const isValid: boolean = await firstValueFrom(
      form.statusChanges.pipe(
        filter((status: FormControlStatus) => status === 'VALID'),
        map(() => true),
        first()
      )
    );
    expect(isValid).toBeTrue();

    // Submit form
    submitBtn.triggerEventHandler('click');
    expect(locationsSpy.addLocation).toHaveBeenCalled();

    // Should reset form state
    expect(form.dirty).toBeFalse();
    expect(form.touched).toBeFalse();
    expect(form.pristine).toBeTrue();
  });
});
