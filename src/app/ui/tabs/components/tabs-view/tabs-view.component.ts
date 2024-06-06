import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChildren,
  effect,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  signal,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ButtonDirective } from '@ui/buttons/directives';
import { CloseIconComponent } from '@ui/icons/close-icon';
import { TabId } from '@ui/tabs';
import { TabsNavigationComponent } from '@ui/tabs/components/tabs-navigation/tabs-navigation.component';

@Component({
  selector: 'app-tabs-view',
  standalone: true,
  imports: [
    CommonModule,
    ButtonDirective,
    CloseIconComponent,
    TabsNavigationComponent,
  ],
  templateUrl: './tabs-view.component.html',
  styleUrl: './tabs-view.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsViewComponent implements OnChanges, AfterViewInit {
  @Input() public autoScrollToTabs: boolean = true;
  @Input() public showNavigationButtons: boolean = true;
  @Input() public autoShowNavigationButtons: boolean = true;

  @Input() public activeTabId?: TabId;
  @Output() public activeTabIdChange = new EventEmitter<TabId | undefined>();

  @ContentChildren(TabComponent) private declaredTabs!: QueryList<TabComponent>;

  private tabs = signal<TabComponent[]>([]);

  protected visibleTabs = computed(() => {
    return this.tabs().filter((oneTab: TabComponent) => !oneTab.isRemoved);
  });

  protected activeTab = signal<TabComponent | null>(null);

  public constructor() {
    effect((): void => {
      this.activeTabId = this.activeTab()?.tabId;
      this.activeTabIdChange.next(this.activeTabId);
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const activeTabIdChange: SimpleChange | undefined = changes['activeTabId'];
    if (activeTabIdChange && activeTabIdChange.currentValue) {
      const tab: TabComponent | undefined = this.getTabById(
        activeTabIdChange.currentValue
      );

      if (tab && tab !== this.activeTab()) {
        this.activeTab.set(tab);
        this.openTab(tab);
      }
    }
  }

  public ngAfterViewInit(): void {
    this.setupTabs();
    this.declaredTabs.changes.pipe(tap(() => this.setupTabs())).subscribe();
  }

  private setupTabs(): void {
    this.tabs.set(this.declaredTabs.toArray());

    /**
     * Open initial tab:
     */
    const activeTab: TabComponent | null = this.activeTab();
    if (
      !activeTab ||
      !this.visibleTabs().includes(activeTab) ||
      activeTab.tabId !== this.activeTabId
    ) {
      let tabToOpen: TabComponent | undefined;
      if (this.activeTabId) {
        tabToOpen = this.getTabById(this.activeTabId);
      }

      if (tabToOpen) {
        this.openTab(tabToOpen);
      } else {
        this.openFirstTab();
      }
    }
  }

  private getTabById(tabId: TabId): TabComponent | undefined {
    return this.visibleTabs().find(oneTab => oneTab.tabId === tabId);
  }

  private openFirstTab(): void {
    const firstTab: TabComponent | undefined = this.visibleTabs()[0];
    if (firstTab) {
      this.openTab(firstTab);
    }
  }

  private openTab(tab: TabComponent): void {
    this.tabs.update((prevTabs: TabComponent[]) => {
      const updatedTabs: TabComponent[] = prevTabs.slice();
      updatedTabs.forEach((oneTab: TabComponent): void => {
        oneTab === tab ? oneTab.show() : oneTab.hide();
      });

      return updatedTabs;
    });

    this.activeTab.set(tab);
  }

  protected onCloseTab(tab: TabComponent, $event?: MouseEvent): void {
    $event?.stopPropagation();
    $event?.preventDefault();

    const prevTab: TabComponent | undefined = this.findPrevTab(tab);
    const nextTab: TabComponent | undefined = this.findNextTab(tab);

    tab.remove();

    if (prevTab) {
      this.openTab(prevTab);
    } else if (nextTab) {
      this.openTab(nextTab);
    } else {
      this.activeTab.set(null);
    }
  }

  protected onOpenTab(tab: TabComponent): void {
    this.openTab(tab);
  }

  protected goToPrevTab(): boolean {
    return this.goToAdjacentTab('prev');
  }

  protected goToNextTab(): boolean {
    return this.goToAdjacentTab('next');
  }

  private findTab(
    relativeTo: TabComponent,
    side: 'prev' | 'next'
  ): TabComponent | undefined {
    const relativeTabIdx: number = this.visibleTabs().indexOf(relativeTo);
    if (relativeTabIdx < 0) {
      return undefined;
    }

    const sideTabIdx = relativeTabIdx + (side === 'prev' ? -1 : 1);

    return this.visibleTabs()[sideTabIdx];
  }

  private findPrevTab(relativeTo: TabComponent): TabComponent | undefined {
    return this.findTab(relativeTo, 'prev');
  }

  private findNextTab(relativeTo: TabComponent): TabComponent | undefined {
    return this.findTab(relativeTo, 'next');
  }

  private goToAdjacentTab(side: 'prev' | 'next'): boolean {
    const currentTab = this.activeTab();
    if (!currentTab) {
      return false;
    }

    let newActiveTab: TabComponent | undefined;
    if (side === 'prev') {
      newActiveTab = this.findPrevTab(currentTab);
    } else {
      newActiveTab = this.findNextTab(currentTab);
    }

    if (newActiveTab) {
      this.openTab(newActiveTab);
    }

    return !!newActiveTab;
  }
}
