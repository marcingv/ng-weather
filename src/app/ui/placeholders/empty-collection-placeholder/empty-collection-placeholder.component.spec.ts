import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyCollectionPlaceholderComponent } from './empty-collection-placeholder.component';
import { Component, DebugElement, Input } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'app-host-component',
  standalone: true,
  template: `
    @if (message) {
      <app-empty-collection-placeholder>{{
        message
      }}</app-empty-collection-placeholder>
    } @else {
      <app-empty-collection-placeholder></app-empty-collection-placeholder>
    }
  `,
  imports: [EmptyCollectionPlaceholderComponent],
})
class HostComponent {
  @Input() public message?: string;
}

describe('EmptyCollectionPlaceholderComponent', (): void => {
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

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should display default message', (): void => {
    const placeholderEl: DebugElement = fixture.debugElement.query(
      By.directive(EmptyCollectionPlaceholderComponent)
    );

    expect(placeholderEl.nativeElement.textContent).toEqual(
      'Collection is empty'
    );
  });

  it('should display projected content', (): void => {
    component.message = 'My custom message';
    fixture.detectChanges();

    const placeholderEl: DebugElement = fixture.debugElement.query(
      By.directive(EmptyCollectionPlaceholderComponent)
    );

    expect(placeholderEl.nativeElement.textContent).toEqual(
      'My custom message'
    );
  });
});
