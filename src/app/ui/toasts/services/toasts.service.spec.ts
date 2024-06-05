import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ToastsService } from './toasts.service';
import { ToastMessage } from '../models/toast-message';

describe('ToastsService', (): void => {
  let service: ToastsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.inject(ToastsService);
  });

  it('should be created', (): void => {
    expect(service).toBeTruthy();
  });

  it('should initially have empty messages', (): void => {
    expect(service.messages().length).toEqual(0);
  });

  it('should add toast message and remove it after delay', fakeAsync((): void => {
    expect(service.messages().length).toEqual(0);

    const message: ToastMessage = {
      message: 'Test message',
      severity: 'primary',
      timeoutMs: 500,
    };

    service.show(message);
    expect(service.messages().length).toEqual(1);
    expect(service.messages()).toContain(message);

    tick(500);

    expect(service.messages()).not.toContain(message);
    expect(service.messages().length).toEqual(0);
  }));

  it('should provide array of messages sorted from newest to oldest', (): void => {
    const messagesToShow: ToastMessage[] = [
      { message: '1', severity: 'primary' },
      { message: '2', severity: 'primary' },
      { message: '3', severity: 'error' },
      { message: '4', severity: 'error' },
      { message: '5', severity: 'primary' },
    ];

    let serviceMessages: ToastMessage[] = [];
    messagesToShow.forEach((oneMessage: ToastMessage): void => {
      service.show(oneMessage);
      serviceMessages = service.messages();
    });

    expect(serviceMessages.length).toEqual(messagesToShow.length);
    expect(serviceMessages[0]).toBe(messagesToShow[4]);
    expect(serviceMessages[1]).toBe(messagesToShow[3]);
    expect(serviceMessages[2]).toBe(messagesToShow[2]);
    expect(serviceMessages[3]).toBe(messagesToShow[1]);
    expect(serviceMessages[4]).toBe(messagesToShow[0]);
  });
});
