import { ScrollableTabItemDirective } from './scrollable-tab-item.directive';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'app-host',
  standalone: true,
  imports: [ScrollableTabItemDirective],
  template: `
    <ul>
      <li appScrollableTabItem="my-tab-id">Item</li>
    </ul>
  `,
})
class HostComponent {
  @ViewChild(ScrollableTabItemDirective, { static: true })
  public directive!: ScrollableTabItemDirective;
}

describe('ScrollableTabItemDirective', (): void => {
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

  it('should create an instance', (): void => {
    expect(component).toBeTruthy();
    expect(component.directive).toBeTruthy();
    expect(component.directive.tabId).toEqual('my-tab-id');
  });

  it('should execute method scrollIntoView with right params', (): void => {
    const directiveDebugEl: DebugElement = fixture.debugElement.query(
      By.directive(ScrollableTabItemDirective)
    );

    expect(directiveDebugEl).toBeTruthy();

    const scrollIntoViewSpy = spyOn(
      directiveDebugEl.nativeElement as HTMLElement,
      'scrollIntoView'
    );

    component.directive.scrollIntoView();
    expect(scrollIntoViewSpy).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  });
});
