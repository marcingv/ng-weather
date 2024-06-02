import { effect, inject, Injectable, Signal, signal } from '@angular/core';
import { ZipCode } from '@core/types';
import { BrowserStorage, LocalStorageService } from '@core/storage';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly STORAGE_KEY = 'locations';
  private readonly storage: BrowserStorage = inject(LocalStorageService);

  private readonly userLocationsSignal = signal<ZipCode[]>(
    this.storage.getItem<ZipCode[]>(this.STORAGE_KEY) ?? []
  );

  public constructor() {
    this.enableStorageSynchronization();
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
  }

  public removeLocation(zipcode: ZipCode): void {
    this.userLocationsSignal.update((prev: ZipCode[]) => {
      return prev
        .slice()
        .filter((oneZipCode: ZipCode) => oneZipCode !== zipcode);
    });
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
