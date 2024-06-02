import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsViewComponent } from './tabs-view.component';
import { Component, DebugElement, signal } from '@angular/core';
import { TabComponent } from '@ui/tabs';
import { By } from '@angular/platform-browser';

interface TabDescriptor {
  id: string;
  label: string;
}

@Component({
  selector: 'app-host',
  standalone: true,
  template: `
    <app-tabs-view>
      @for (oneTab of tabs(); track oneTab) {
        <app-tab [tabId]="oneTab.id" [label]="oneTab.label">
          Content of {{ oneTab.label }}
        </app-tab>
      }
    </app-tabs-view>
  `,
  imports: [TabsViewComponent, TabComponent],
})
class HostComponent {
  public tabs = signal<TabDescriptor[]>([]);
}

describe('TabViewComponent', () => {
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

    const tabsView: DebugElement = fixture.debugElement.query(
      By.directive(TabsViewComponent)
    );
    expect(tabsView).toBeTruthy();
  });

  it('should render tabs navigator and tabs panels', (): void => {
    const tabs: TabDescriptor[] = [
      { id: 'tab-1', label: 'Label #1' },
      { id: 'tab-2', label: 'Label #2' },
    ];
    component.tabs.set(tabs);
    fixture.detectChanges();

    const tabsView: DebugElement = fixture.debugElement.query(
      By.directive(TabsViewComponent)
    );
    const tabsNavigation: DebugElement = fixture.debugElement.query(
      By.css('.tabs-navigation__list')
    );
    const tabPanels: DebugElement[] = fixture.debugElement.queryAll(
      By.directive(TabComponent)
    );

    expect(tabsView).toBeTruthy();
    expect(tabPanels.length).toEqual(tabs.length);
    expect(tabsNavigation).toBeTruthy();

    const tabsNavigationItems: DebugElement[] = tabsNavigation.queryAll(
      By.css('.tabs-navigation__item')
    );
    expect(tabsNavigationItems.length).toEqual(tabs.length);
  });

  it('should initially display the first tab content', (): void => {
    const tabs: TabDescriptor[] = [
      { id: 'tab-1', label: 'Label #1' },
      { id: 'tab-2', label: 'Label #2' },
    ];
    component.tabs.set(tabs);
    fixture.detectChanges();

    const tabsNavigation: DebugElement = fixture.debugElement.query(
      By.css('.tabs-navigation__list')
    );
    const tabsNavigationItems: DebugElement[] = tabsNavigation.queryAll(
      By.css('.tabs-navigation__item')
    );
    const tabPanels: DebugElement[] = fixture.debugElement.queryAll(
      By.directive(TabComponent)
    );

    expect(tabsNavigationItems.length).toEqual(tabs.length);

    // First item should be active and visible
    expect(tabsNavigationItems[0].attributes['tab-id']).toEqual(tabs[0].id);
    expect(tabsNavigationItems[0].attributes['class']).toContain('active');
    expect(tabPanels[0].attributes['style']).toContain('display: block;');
    expect(tabPanels[0].nativeElement.textContent).toContain(
      `Content of ${tabs[0].label}`
    );

    // Second item should not be active
    expect(tabsNavigationItems[1].attributes['tab-id']).toEqual(tabs[1].id);
    expect(tabsNavigationItems[1].attributes['class']).not.toContain('active');
    expect(tabPanels[1].attributes['style']).not.toContain('display: block;');
    expect(tabPanels[1].attributes['style']).toContain('display: none;');
  });

  it('should allow navigation between tabs', (): void => {
    const tabs: TabDescriptor[] = [
      { id: 'tab-1', label: 'Label #1' },
      { id: 'tab-2', label: 'Label #2' },
    ];
    component.tabs.set(tabs);
    fixture.detectChanges();

    const tabsNavigation: DebugElement = fixture.debugElement.query(
      By.css('.tabs-navigation__list')
    );
    const tabsNavigationItems: DebugElement[] = tabsNavigation.queryAll(
      By.css('.tabs-navigation__item')
    );
    const tabPanels: DebugElement[] = fixture.debugElement.queryAll(
      By.directive(TabComponent)
    );

    expect(tabsNavigationItems.length).toEqual(tabs.length);

    // First item should be active and visible:
    expect(tabsNavigationItems[0].attributes['class']).toContain('active');
    expect(tabsNavigationItems[1].attributes['class']).not.toContain('active');
    expect(tabPanels[0].attributes['style']).toContain('display: block;');
    expect(tabPanels[1].attributes['style']).toContain('display: none;');

    // Change to second tab:
    tabsNavigationItems[1].triggerEventHandler('click');
    fixture.detectChanges();

    expect(tabsNavigationItems[0].attributes['class']).not.toContain('active');
    expect(tabsNavigationItems[1].attributes['class']).toContain('active');
    expect(tabPanels[0].attributes['style']).toContain('display: none;');
    expect(tabPanels[1].attributes['style']).toContain('display: block;');

    // Get back to first tab:
    tabsNavigationItems[0].triggerEventHandler('click');
    fixture.detectChanges();

    expect(tabsNavigationItems[0].attributes['class']).toContain('active');
    expect(tabsNavigationItems[1].attributes['class']).not.toContain('active');
    expect(tabPanels[0].attributes['style']).toContain('display: block;');
    expect(tabPanels[1].attributes['style']).toContain('display: none;');
  });

  it('should close tab and show the nearest one', (): void => {
    const tabs: TabDescriptor[] = [
      { id: 'tab-1', label: 'Label #1' },
      { id: 'tab-2', label: 'Label #2' },
      { id: 'tab-3', label: 'Label #3' },
    ];
    component.tabs.set(tabs);
    fixture.detectChanges();

    const tabsNavigation: DebugElement = fixture.debugElement.query(
      By.css('.tabs-navigation__list')
    );
    const tabsNavigationItems: DebugElement[] = tabsNavigation.queryAll(
      By.css('.tabs-navigation__item')
    );
    const tabPanels: DebugElement[] = fixture.debugElement.queryAll(
      By.directive(TabComponent)
    );
    const tab1CloseBtn: DebugElement = tabsNavigationItems[0].query(
      By.css('.tab-close-btn')
    );
    const tab2CloseBtn: DebugElement = tabsNavigationItems[1].query(
      By.css('.tab-close-btn')
    );
    const tab3CloseBtn: DebugElement = tabsNavigationItems[2].query(
      By.css('.tab-close-btn')
    );

    expect(tabsNavigationItems.length).toEqual(tabs.length);
    expect(tab1CloseBtn).toBeTruthy();
    expect(tab2CloseBtn).toBeTruthy();
    expect(tab3CloseBtn).toBeTruthy();

    // First item should be active and visible:
    expect(tabsNavigationItems[0].attributes['class']).toContain('active');
    expect(tabPanels[0].attributes['style']).toContain('display: block;');

    // Close active tab:
    tab1CloseBtn.triggerEventHandler('click');
    fixture.detectChanges();

    expect(
      tabsNavigation.queryAll(By.css('.tabs-navigation__item')).length
    ).toEqual(tabs.length - 1);

    // Second tab should be active:
    expect(tabsNavigationItems[1].attributes['class']).toContain('active');
    expect(tabPanels[1].attributes['style']).toContain('display: block;');

    // Close the last tab (not currently active):
    tab3CloseBtn.triggerEventHandler('click');
    fixture.detectChanges();

    expect(
      tabsNavigation.queryAll(By.css('.tabs-navigation__item')).length
    ).toEqual(tabs.length - 2);

    // Close the very last tab:
    tab2CloseBtn.triggerEventHandler('click');
    fixture.detectChanges();

    expect(
      tabsNavigation.queryAll(By.css('.tabs-navigation__item')).length
    ).toEqual(0);
  });

  it('should add new tab dynamically', (): void => {
    const tabs: TabDescriptor[] = [
      { id: 'tab-1', label: 'Label #1' },
      { id: 'tab-2', label: 'Label #2' },
    ];
    component.tabs.set(tabs);
    fixture.detectChanges();

    const tabsNavigation: DebugElement = fixture.debugElement.query(
      By.css('.tabs-navigation__list')
    );
    let tabsNavigationItems: DebugElement[] = tabsNavigation.queryAll(
      By.css('.tabs-navigation__item')
    );

    expect(tabsNavigationItems.length).toEqual(tabs.length);

    // Select second tab:
    tabsNavigationItems[1].triggerEventHandler('click');
    fixture.detectChanges();

    // Second tab should be active:
    expect(tabsNavigationItems[1].attributes['class']).toContain('active');

    // Add new tab:
    component.tabs.set([...tabs, { id: '3', label: 'Label #3' }]);
    fixture.detectChanges();

    tabsNavigationItems = tabsNavigation.queryAll(
      By.css('.tabs-navigation__item')
    );
    expect(tabsNavigationItems.length).toEqual(tabs.length + 1);

    // Previously active tab should still be active
    expect(tabsNavigationItems[1].attributes['class']).toContain('active');
  });
});
