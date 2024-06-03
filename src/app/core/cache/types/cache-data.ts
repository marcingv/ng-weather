import { CacheEntry } from './cache-entry';

export interface CacheData {
  entries: { [entryKey: string]: CacheEntry<unknown> };
}
