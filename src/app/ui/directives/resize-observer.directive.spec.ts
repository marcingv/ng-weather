import { ResizeObserverDirective } from './resize-observer.directive';
import { Component, Input, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

@Component({
  selector: 'app-host',
  standalone: true,
  styles: [':host { display: block; width: 800px }'],
  template: `
    <div [appResizeObserver]="true" [style.width.px]="width">Hello</div>
  `,
  imports: [ResizeObserverDirective],
})
class HostComponent {
  @Input() public width: number = 400;

  @ViewChild(ResizeObserverDirective, { static: true })
  resizeObserverDirective!: ResizeObserverDirective;
}

describe('ResizeObserverDirective', () => {
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

  it('should create an instance', () => {
    expect(component).toBeTruthy();
    expect(component.resizeObserverDirective).toBeTruthy();
  });
});
