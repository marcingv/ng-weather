import { distinctUntilChanged, filter, fromEvent, map, Observable } from 'rxjs';

export abstract class BrowserStorage {
  private remoteStorageChange$: Observable<StorageEvent> = (
    fromEvent(window, 'storage') as Observable<StorageEvent>
  ).pipe(
    filter(
      (event: StorageEvent) => event.storageArea === this.storageProvider()
    )
  );

  public remoteChangeNotification<T>(key: string): Observable<T | null> {
    return this.remoteStorageChange$.pipe(
      filter((event: StorageEvent) => event.key === key),
      map((event: StorageEvent) => event.newValue),
      distinctUntilChanged(),
      map((newValue: string | null) => this.parseJsonValue(newValue))
    );
  }

  public getItem<T>(key: string): T | null {
    return this.readItemValue(key);
  }

  public setItem<T>(key: string, value: T): void {
    this.storageProvider().setItem(key, JSON.stringify(value));
  }

  public hasItem(key: string): boolean {
    return !!this.getItem(key);
  }

  public clearItem(key: string): void {
    this.storageProvider().removeItem(key);
  }

  private readItemValue<T>(key: string): T | null {
    const json: string | null = this.storageProvider().getItem(key);

    return this.parseJsonValue<T>(json);
  }

  private parseJsonValue<T>(json: string | null): T | null {
    if (!json || !json.length) {
      return null;
    }

    try {
      return JSON.parse(json) as T;
    } catch (e) {
      // JSON parse exception
      return null;
    }
  }

  protected abstract storageProvider(): Storage;
}
