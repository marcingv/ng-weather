import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlErrorsComponent } from './control-errors.component';
import { ValidationErrors } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

describe('ControlErrorsComponent', () => {
  let component: ControlErrorsComponent;
  let fixture: ComponentFixture<ControlErrorsComponent>;

  const errors = {
    errorCode: {
      message: 'My custom error message',
    },
  } satisfies ValidationErrors;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlErrorsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlErrorsComponent);
    component = fixture.componentInstance;
    component.errors = errors;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error message', (): void => {
    expect(fixture.nativeElement.textContent).toContain(
      errors.errorCode.message
    );
  });

  it('should display nothing when errors are not provided', (): void => {
    component.errors = null;
    fixture.componentRef.injector.get(ChangeDetectorRef).detectChanges();

    expect(fixture.nativeElement.textContent).toEqual('');
  });
});
