import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';

import { inject } from '@angular/core';
import { of, switchMap, tap } from 'rxjs';
import { CacheEntry, HttpMethod } from '@core/cache/types';
import { BrowserCache, LocalStorageCacheService } from '@core/cache/services';

interface Options {
  urls?: string[];
  methods: HttpMethod[];
}

export const cachedHttpRequestsInterceptor = (
  options: Options = { methods: ['GET'] }
): HttpInterceptorFn => {
  return (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    if (!isCacheable(req, options)) {
      return next(req);
    }

    const cacheService: BrowserCache = inject(LocalStorageCacheService);
    const cacheKey: string = createCacheKey(req);

    return cacheService.getEntry<HttpResponse<unknown>>(cacheKey).pipe(
      switchMap((cacheEntry: CacheEntry<HttpResponse<unknown>> | null) => {
        if (cacheEntry && cacheEntry.isFresh()) {
          return of(
            new HttpResponse({
              body: cacheEntry.data.body,
              url: cacheEntry.data.url ?? undefined,
              status: cacheEntry.data.status,
              statusText: cacheEntry.data.statusText,
              headers: cacheEntry.data.headers,
            })
          );
        }

        return next(req).pipe(
          tap((event: HttpEvent<unknown>): void => {
            if (event instanceof HttpResponse) {
              cacheService.set(cacheKey, event);
            }
          })
        );
      })
    );
  };
};

const createCacheKey = (req: HttpRequest<unknown>): string => {
  return `${req.method}_${req.urlWithParams}`;
};

const isCacheable = (req: HttpRequest<unknown>, options: Options): boolean => {
  if (!options.methods.includes(req.method.toUpperCase() as HttpMethod)) {
    return false;
  }

  if (!options.urls || !options.urls.length) {
    // When urls array is empty, we allow all requests to be cached
    return true;
  }

  // Allow request to be cached if request's url matches one of the patterns
  return !!options.urls.find((oneUrlPattern: string) =>
    req.urlWithParams.startsWith(oneUrlPattern)
  );
};
