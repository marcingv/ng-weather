import { Injectable } from '@angular/core';
import { WeatherService } from './weather.service';
import { ZipCode } from '@core/types';

export const LOCATIONS: string = 'locations';

@Injectable({ providedIn: 'root' })
export class LocationService {
  locations: string[] = [];

  constructor(private weatherService: WeatherService) {
    const locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      this.locations = JSON.parse(locString);
    }
    for (const loc of this.locations) {
      this.weatherService.addCurrentConditions(loc);
    }
  }

  addLocation(zipcode: ZipCode) {
    this.locations.push(zipcode);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    this.weatherService.addCurrentConditions(zipcode);
  }

  removeLocation(zipcode: ZipCode) {
    const index = this.locations.indexOf(zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      this.weatherService.removeCurrentConditions(zipcode);
    }
  }
}
