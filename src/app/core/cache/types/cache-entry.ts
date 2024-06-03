import { ENVIRONMENT } from '@environments/environment';

export class CacheEntry<T> {
  public readonly data: T;
  public readonly timestamp: number;

  public constructor(data: T, timestamp: number) {
    this.data = data;
    this.timestamp = timestamp;
  }

  public isFresh(): boolean {
    return !this.isStale();
  }

  public isStale(): boolean {
    return this.timestamp + ENVIRONMENT.CACHE_LIFESPAN_MILLIS < Date.now();
  }
}
