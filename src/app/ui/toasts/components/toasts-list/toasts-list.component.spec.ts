import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastsListComponent } from './toasts-list.component';
import { ToastMessage } from '../../models/toast-message';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ToastListItemComponent } from '../toast-list-item/toast-list-item.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('ToastsListComponent', (): void => {
  let component: ToastsListComponent;
  let fixture: ComponentFixture<ToastsListComponent>;

  const primaryToast: ToastMessage = {
    message: 'Test message',
    severity: 'primary',
  };

  const errorToast: ToastMessage = {
    message: 'Test message',
    severity: 'error',
  };

  const toasts: ToastMessage[] = [primaryToast, errorToast];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastsListComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastsListComponent);
    component = fixture.componentInstance;
    component.messages = toasts;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should display a list of toasts', (): void => {
    const liElems: DebugElement[] = fixture.debugElement.queryAll(
      By.directive(ToastListItemComponent)
    );

    expect(liElems).toBeTruthy();
    expect(liElems.length).toEqual(toasts.length);
  });
});
