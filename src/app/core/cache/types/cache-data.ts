import { CacheEntry } from './cache-entry';
import { CacheEntryKey } from './cache-entry-key';

export interface CacheData {
  entries: { [id: CacheEntryKey]: CacheEntry<unknown> };
}
