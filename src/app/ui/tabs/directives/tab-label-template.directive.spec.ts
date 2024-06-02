import { TabLabelTemplateDirective } from './tab-label-template.directive';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

@Component({
  selector: 'app-host',
  standalone: true,
  template: ` <ng-template appTabLabelTemplate></ng-template>`,
  imports: [TabLabelTemplateDirective],
})
class HostComponent {
  @ViewChild(TabLabelTemplateDirective, { static: true })
  public tabLabel!: TabLabelTemplateDirective;
}

describe('TabLabelTemplateDirective', (): void => {
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
    expect(component.tabLabel).toBeTruthy();
  });

  it('should expose template ref', (): void => {
    expect(component.tabLabel).toBeTruthy();
    expect(component.tabLabel.template).toBeTruthy();
    expect(component.tabLabel.template).toBeInstanceOf(TemplateRef);
  });
});
