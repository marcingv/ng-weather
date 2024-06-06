import { TabLazyContentTemplateDirective } from './tab-lazy-content-template.directive';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

@Component({
  selector: 'app-host',
  standalone: true,
  template: ` <ng-template appTabLazyContentTemplate></ng-template>`,
  imports: [TabLazyContentTemplateDirective],
})
class HostComponent {
  @ViewChild(TabLazyContentTemplateDirective, { static: true })
  public tabLazyContent!: TabLazyContentTemplateDirective;
}

describe('TabLazyContentTemplateDirective', (): void => {
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
    expect(component.tabLazyContent).toBeTruthy();
  });

  it("should expose tab's content template ref", (): void => {
    expect(component.tabLazyContent).toBeTruthy();
    expect(component.tabLazyContent.template).toBeTruthy();
    expect(component.tabLazyContent.template).toBeInstanceOf(TemplateRef);
  });
});
