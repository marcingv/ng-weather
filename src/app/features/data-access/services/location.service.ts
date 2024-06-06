import { effect, inject, Injectable, Signal, signal } from '@angular/core';
import { ZipCode } from '@core/types';
import { BrowserStorage, LocalStorageService } from '@core/storage';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ZipcodeAndCity } from '@features/data-access/types';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly STORAGE_KEY = 'locations';
  private readonly storage: BrowserStorage = inject(LocalStorageService);

  private readonly userLocationsSignal = signal<ZipcodeAndCity[]>(
    this.storage.getItem<ZipcodeAndCity[]>(this.STORAGE_KEY) ?? []
  );

  public constructor() {
    this.enableStorageSynchronization();
  }

  public get userLocations(): Signal<ZipcodeAndCity[]> {
    return this.userLocationsSignal.asReadonly();
  }

  public findLocationByZipcode(zipcode: ZipCode): ZipcodeAndCity | undefined {
    return this.userLocations().find(
      (oneLocation: ZipcodeAndCity): boolean => oneLocation.zipcode === zipcode
    );
  }

  public addLocation(location: ZipcodeAndCity): void {
    this.userLocationsSignal.update((prev: ZipcodeAndCity[]) => {
      if (prev.find(oneEntry => oneEntry.zipcode === location.zipcode)) {
        return prev;
      }

      return [...prev, location];
    });
  }

  public removeLocation(zipcode: ZipCode): void {
    this.userLocationsSignal.update((prev: ZipcodeAndCity[]) => {
      return prev
        .slice()
        .filter((oneEntry: ZipcodeAndCity) => oneEntry.zipcode !== zipcode);
    });
  }

  private enableStorageSynchronization(): void {
    effect(() => {
      const locations: ZipcodeAndCity[] = this.userLocations();

      this.storage.setItem(this.STORAGE_KEY, locations);
    });

    this.storage
      .remoteChangeNotification<ZipcodeAndCity[]>(this.STORAGE_KEY)
      .pipe(
        tap((remoteTabLocations: ZipcodeAndCity[] | null) => {
          if (remoteTabLocations) {
            this.userLocationsSignal.set(remoteTabLocations);
          }
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
