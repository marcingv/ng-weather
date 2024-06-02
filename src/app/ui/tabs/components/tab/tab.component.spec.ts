import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabComponent } from './tab.component';

describe('TabComponent', (): void => {
  let component: TabComponent;
  let fixture: ComponentFixture<TabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should emit event on tab show', (): void => {
    let eventCalled: boolean | undefined;

    component.tabShown.subscribe(() => (eventCalled = true));
    component.show();

    expect(eventCalled).toBeTrue();
  });

  it('should emit event on tab hide', (): void => {
    let eventCalled: boolean | undefined;

    component.tabHidden.subscribe(() => (eventCalled = true));
    component.hide();

    expect(eventCalled).toBeTrue();
  });

  it('should emit event on tab remove', (): void => {
    let eventCalled: boolean | undefined;

    component.tabRemoved.subscribe(() => (eventCalled = true));
    component.remove();

    expect(eventCalled).toBeTrue();
  });
});
