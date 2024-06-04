export interface CacheEntry<T> {
  readonly data: T;
  readonly timestamp: number;
}
