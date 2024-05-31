import { effect, inject, Injectable, Signal, signal } from '@angular/core';
import { WeatherService } from './weather.service';
import { ZipCode } from '@core/types';
import { BrowserStorage, LocalStorageService } from '@core/storage';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly STORAGE_KEY = 'locations';
  private storage: BrowserStorage = inject(LocalStorageService);

  private userLocationsSignal = signal<ZipCode[]>(
    this.storage.getItem<ZipCode[]>(this.STORAGE_KEY) ?? []
  );

  locations: string[] = [];

  public constructor(private weatherService: WeatherService) {
    this.enableStorageSynchronization();

    const locString = localStorage.getItem(this.STORAGE_KEY);
    if (locString) {
      this.locations = JSON.parse(locString);
    }
    for (const loc of this.locations) {
      this.weatherService.addCurrentConditions(loc);
    }
  }

  public get userLocations(): Signal<ZipCode[]> {
    return this.userLocationsSignal.asReadonly();
  }

  public addLocation(zipcode: ZipCode): void {
    this.userLocationsSignal.update((prev: ZipCode[]) => {
      if (prev.includes(zipcode)) {
        return prev;
      }

      return [...prev, zipcode];
    });

    this.locations.push(zipcode);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.locations));
    this.weatherService.addCurrentConditions(zipcode);
  }

  public removeLocation(zipcode: ZipCode): void {
    this.userLocationsSignal.update((prev: ZipCode[]) => {
      return prev
        .slice()
        .filter((oneZipCode: ZipCode) => oneZipCode !== zipcode);
    });

    const index = this.locations.indexOf(zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.locations));
      this.weatherService.removeCurrentConditions(zipcode);
    }
  }

  private enableStorageSynchronization(): void {
    effect(() => {
      const locations: ZipCode[] = this.userLocations();

      this.storage.setItem(this.STORAGE_KEY, locations);
    });

    this.storage
      .remoteChangeNotification<ZipCode[]>(this.STORAGE_KEY)
      .pipe(
        tap((remoteTabLocations: ZipCode[] | null) => {
          if (remoteTabLocations) {
            this.userLocationsSignal.set(remoteTabLocations);
          }
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
