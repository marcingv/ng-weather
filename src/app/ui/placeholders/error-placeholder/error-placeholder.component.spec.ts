import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorPlaceholderComponent } from './error-placeholder.component';
import { Component, DebugElement, Input } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'app-host-component',
  standalone: true,
  template: `
    @if (message) {
      <app-error-placeholder>{{ message }}</app-error-placeholder>
    } @else {
      <app-error-placeholder></app-error-placeholder>
    }
  `,
  imports: [ErrorPlaceholderComponent],
})
class HostComponent {
  @Input() public message?: string;
}

describe('ErrorPlaceholderComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default message', (): void => {
    const placeholderEl: DebugElement = fixture.debugElement.query(
      By.directive(ErrorPlaceholderComponent)
    );

    expect(placeholderEl.nativeElement.textContent).toEqual(
      'An error occurred'
    );
  });

  it('should display projected content', (): void => {
    component.message = 'My custom message';
    fixture.detectChanges();

    const placeholderEl: DebugElement = fixture.debugElement.query(
      By.directive(ErrorPlaceholderComponent)
    );

    expect(placeholderEl.nativeElement.textContent).toEqual(
      'My custom message'
    );
  });
});
