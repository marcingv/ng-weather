import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastsContainerComponent } from './toasts-container.component';
import { ToastsService } from '../../services/toasts.service';
import { DebugElement, signal, WritableSignal } from '@angular/core';
import { ToastMessage } from '../../models/toast-message';
import { By } from '@angular/platform-browser';
import { ToastsListComponent } from '../toasts-list/toasts-list.component';

describe('ToastsContainerComponent', () => {
  let component: ToastsContainerComponent;
  let fixture: ComponentFixture<ToastsContainerComponent>;

  let messagesSignal: WritableSignal<ToastMessage[]>;
  let toastsService: Partial<ToastsService> = {};

  beforeEach(async () => {
    messagesSignal = signal<ToastMessage[]>([]);
    toastsService = {
      messages: messagesSignal,
    };

    await TestBed.configureTestingModule({
      imports: [ToastsContainerComponent],
      providers: [{ provide: ToastsService, useValue: toastsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should display toasts list', (): void => {
    const listEl: DebugElement = fixture.debugElement.query(
      By.directive(ToastsListComponent)
    );

    expect(listEl).toBeTruthy();
  });
});
