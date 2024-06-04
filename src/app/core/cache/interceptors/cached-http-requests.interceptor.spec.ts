import { TestBed } from '@angular/core/testing';
import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { cachedHttpRequestsInterceptor } from './cached-http-requests.interceptor';
import { CacheEntry, HttpMethod } from '@core/cache/types';
import createSpyObj = jasmine.createSpyObj;
import { BrowserCache, LocalStorageCacheService } from '@core/cache/services';
import SpyObj = jasmine.SpyObj;
import { Observable, of } from 'rxjs';
import { ENVIRONMENT } from '@environments/environment';

describe('cachedHttpRequestsInterceptor', (): void => {
  const methods: HttpMethod[] = ['GET'];
  const urls: string[] = ['http://localhost:4200/api/endpoint-1'];

  let interceptor: HttpInterceptorFn;
  let cacheService: SpyObj<BrowserCache>;

  const nextHandler: HttpHandlerFn = (
    req: HttpRequest<unknown>
  ): Observable<HttpEvent<unknown>> => {
    return of(
      new HttpResponse({
        url: req.url,
        body: 'Sample response body',
        status: 200,
      })
    );
  };

  beforeEach((): void => {
    cacheService = createSpyObj<BrowserCache>([
      'getEntry',
      'set',
      'isEntryFresh',
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: LocalStorageCacheService, useValue: cacheService },
      ],
    });

    interceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn) =>
      TestBed.runInInjectionContext(() =>
        cachedHttpRequestsInterceptor({ methods: methods, urls: urls })(
          req,
          next
        )
      );
  });

  it('should be created', (): void => {
    expect(interceptor).toBeTruthy();
  });

  it('should not use cache when request method is not supported', (): void => {
    const req: HttpRequest<unknown> = new HttpRequest<unknown>(
      'POST',
      urls[0],
      null
    );
    const next = jasmine.createSpy('next');

    interceptor(req, next);
    expect(next).toHaveBeenCalledWith(req);
  });

  it('should not use cache when request url is not supported', (): void => {
    const req: HttpRequest<unknown> = new HttpRequest<unknown>(
      'GET',
      'http://localhost/not-supported-url'
    );
    const next = jasmine.createSpy('next');

    interceptor(req, next);
    expect(next).toHaveBeenCalledWith(req);
  });

  it('should execute http request if there is no cache entry for request', (): void => {
    cacheService.getEntry.and.returnValue(of(null));

    const req: HttpRequest<unknown> = new HttpRequest<unknown>('GET', urls[0]);
    const next = jasmine.createSpy('next', nextHandler);
    next.and.callThrough();

    interceptor(req, next).subscribe();
    expect(next).toHaveBeenCalledWith(req);
  });

  it('should execute http request if cache entry is stale', (): void => {
    const req: HttpRequest<unknown> = new HttpRequest<unknown>('GET', urls[0]);
    const cacheEntry: CacheEntry<HttpResponse<unknown>> = {
      data: new HttpResponse<unknown>({
        url: req.url,
        body: 'Sample response body',
        status: 200,
      }),
      timestamp: Date.now() - ENVIRONMENT.CACHE_LIFESPAN_MILLIS,
    };
    cacheService.isEntryFresh.and.returnValue(false);
    cacheService.getEntry.and.returnValue(of(cacheEntry));

    const next = jasmine.createSpy('next', nextHandler);
    next.and.callThrough();

    interceptor(req, next).subscribe();
    expect(next).toHaveBeenCalledWith(req);
  });

  it('should return cached response when cache entry is fresh', (): void => {
    const req: HttpRequest<unknown> = new HttpRequest<unknown>('GET', urls[0]);
    const cacheEntry: CacheEntry<HttpResponse<unknown>> = {
      data: new HttpResponse<unknown>({
        url: req.url,
        body: 'Sample response body',
        status: 200,
      }),
      timestamp: Date.now(),
    };
    cacheService.isEntryFresh.and.returnValue(true);
    cacheService.getEntry.and.returnValue(of(cacheEntry));

    const next = jasmine.createSpy('next', nextHandler);
    next.and.callThrough();

    let response: HttpEvent<unknown> | undefined;
    interceptor(req, next).subscribe(res => (response = res));

    expect(next).not.toHaveBeenCalled();
    expect(response).toBeTruthy();
    expect(response).toEqual(cacheEntry.data);
  });

  it('should cache http response data', (): void => {
    const req: HttpRequest<unknown> = new HttpRequest<unknown>('GET', urls[0]);
    cacheService.getEntry.and.returnValue(of(null));

    const next = jasmine.createSpy('next', nextHandler);
    next.and.callThrough();

    let response: HttpEvent<unknown> | undefined;
    interceptor(req, next).subscribe(res => (response = res));

    expect(next).toHaveBeenCalled();
    expect(response).toBeTruthy();
    expect(cacheService.set).toHaveBeenCalledWith(
      `${req.method}_${req.urlWithParams}`,
      response
    );
  });
});
