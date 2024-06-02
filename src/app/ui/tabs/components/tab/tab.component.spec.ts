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

  it('should emit event on tab remove', (): void => {
    let removedEventCalled: boolean | undefined;

    component.removed.subscribe(() => (removedEventCalled = true));
    component.remove();

    expect(removedEventCalled).toBeTrue();
  });
});
