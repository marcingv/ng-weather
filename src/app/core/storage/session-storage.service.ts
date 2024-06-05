import { Injectable } from '@angular/core';
import { BrowserStorage } from '@core/storage/browser-storage';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService extends BrowserStorage {
  protected override storageProvider(): Storage {
    return sessionStorage;
  }
}
