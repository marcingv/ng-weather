import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastListItemComponent } from './toast-list-item.component';
import { ToastMessage } from '../../models/toast-message';
import { ChangeDetectorRef, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ToastListItemComponent', () => {
  let component: ToastListItemComponent;
  let fixture: ComponentFixture<ToastListItemComponent>;

  const primaryToast: ToastMessage = {
    message: 'Test message',
    severity: 'primary',
  };

  const errorToast: ToastMessage = {
    message: 'Test message',
    severity: 'error',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastListItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastListItemComponent);
    component = fixture.componentInstance;
    component.toast = primaryToast;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should display primary toast', (): void => {
    const toastElem: DebugElement = fixture.debugElement.query(
      By.css('.toast')
    );

    expect(toastElem).toBeTruthy();
    expect(toastElem.attributes['class']).toContain('toast-primary');
    expect(toastElem.nativeElement.textContent).toContain(primaryToast.message);
  });

  it('should display error toast', (): void => {
    component.toast = errorToast;
    fixture.componentRef.injector.get(ChangeDetectorRef).detectChanges();

    const toastElem: DebugElement = fixture.debugElement.query(
      By.css('.toast')
    );

    expect(toastElem).toBeTruthy();
    expect(toastElem.attributes['class']).toContain('toast-error');
    expect(toastElem.nativeElement.textContent).toContain(primaryToast.message);
  });
});
