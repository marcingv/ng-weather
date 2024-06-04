import { Injectable } from '@angular/core';
import { BrowserStorage } from '@core/storage';
import { InMemoryStorage } from '@testing/storage/in-memory.storage';
import { distinctUntilChanged, filter, map, Observable, Subject } from 'rxjs';

@Injectable()
export class InMemoryStorageService extends BrowserStorage {
  public remoteDataChange$: Subject<{ key: string; value: unknown }> =
    new Subject<{ key: string; value: unknown }>();

  public storage: InMemoryStorage = new InMemoryStorage();

  protected override storageProvider(): Storage {
    return this.storage;
  }

  override remoteChangeNotification<T>(key: string): Observable<T | null> {
    return this.remoteDataChange$.pipe(
      filter((event: { key: string; value: unknown }) => event.key === key),
      map((event: { key: string; value: unknown }) => event.value),
      distinctUntilChanged(),
      map((newValue: unknown | null) => newValue as T)
    );
  }
}
