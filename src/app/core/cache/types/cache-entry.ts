import { CacheEntryKey } from './cache-entry-key';

export interface CacheEntry<T> {
  readonly key: CacheEntryKey;
  readonly data: T;
  readonly timestamp: number;
}
