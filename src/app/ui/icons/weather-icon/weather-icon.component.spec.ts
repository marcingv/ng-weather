import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherIconComponent } from './weather-icon.component';
import { WeatherFactory } from '@testing/weather.factory';
import { Weather } from '@core/types';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('WeatherIconComponent', (): void => {
  let component: WeatherIconComponent;
  let fixture: ComponentFixture<WeatherIconComponent>;

  const weather: Weather = WeatherFactory.createInstance({
    description: 'weather description',
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherIconComponent);
    component = fixture.componentInstance;
    component.weather = weather;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should render weather icon', (): void => {
    const imgEl: DebugElement = fixture.debugElement.query(By.css('img'));

    expect(imgEl).toBeTruthy();
    expect(imgEl.attributes['title']).toEqual(`${weather.description}`);
    expect(imgEl.attributes['alt']).toEqual(`Weather: ${weather.description}`);
  });
});
