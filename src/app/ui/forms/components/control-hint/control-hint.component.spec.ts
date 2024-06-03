import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlHintComponent } from './control-hint.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-host-component',
  standalone: true,
  template: ` <app-control-hint>This is my hint content</app-control-hint>`,
  imports: [ControlHintComponent],
})
class HostComponent {}

describe('HostComponent', () => {
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

  it('should display projected content', (): void => {
    expect(fixture.nativeElement.textContent).toContain(
      'This is my hint content'
    );
  });
});
