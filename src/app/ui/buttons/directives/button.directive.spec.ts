import { ButtonDirective } from './button.directive';
import { Component, DebugElement } from '@angular/core';
import { ButtonType } from '@ui/buttons/types';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'app-host-cmp',
  standalone: true,
  imports: [ButtonDirective],
  template: '<button [appButton]="buttonType">Test button</button>',
})
class HostComponent {
  public buttonType: ButtonType = 'primary';
}

describe('ButtonDirective', () => {
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

  it('should append button css classes based on type', () => {
    const button: DebugElement = fixture.debugElement.query(
      By.directive(ButtonDirective)
    );

    expect(button).toBeTruthy();
    expect(button.attributes['class']).toContain('app-button');
    expect(button.attributes['class']).toContain('app-button-primary');

    component.buttonType = 'secondary';
    fixture.detectChanges();
    expect(button.attributes['class']).toContain('app-button');
    expect(button.attributes['class']).toContain('app-button-secondary');
    expect(button.attributes['class']).not.toContain('app-button-primary');

    component.buttonType = 'transparent';
    fixture.detectChanges();
    expect(button.attributes['class']).toContain('app-button');
    expect(button.attributes['class']).toContain('app-button-transparent');
    expect(button.attributes['class']).not.toContain('app-button-secondary');
  });
});
