import { computed, Injectable, signal } from '@angular/core';
import { TabComponent } from '../components/tab';
import { TabId } from '../types';

@Injectable()
export class TabsService {
  private _tabs = signal<TabComponent[]>([]);
  private _activeTab = signal<TabComponent | null>(null);

  public visibleTabs = computed(() => {
    return this._tabs().filter((oneTab: TabComponent) => !oneTab.isRemoved);
  });
  public activeTab = this._activeTab.asReadonly();

  public setupTabs(declaredTabs: TabComponent[], activeTabId?: TabId): void {
    this._tabs.set(declaredTabs);

    /**
     * Open initial tab:
     */
    const activeTab: TabComponent | null = this._activeTab();
    if (
      !activeTab ||
      !this.visibleTabs().includes(activeTab) ||
      activeTab.tabId !== activeTabId
    ) {
      let tabToOpen: TabComponent | undefined;
      if (activeTabId) {
        tabToOpen = this.getTabById(activeTabId);
      }

      if (tabToOpen) {
        this.openTab(tabToOpen);
      } else {
        this.openFirstTab();
      }
    }
  }

  public changeActiveTabTo(tabId: TabId): void {
    const tab: TabComponent | undefined = this.getTabById(tabId);

    if (tab && tab !== this._activeTab()) {
      this._activeTab.set(tab);
      this.openTab(tab);
    }
  }

  public openTab(tab: TabComponent): void {
    this._tabs.update((prevTabs: TabComponent[]) => {
      const updatedTabs: TabComponent[] = prevTabs.slice();
      updatedTabs.forEach((oneTab: TabComponent): void => {
        oneTab === tab ? oneTab.show() : oneTab.hide();
      });

      return updatedTabs;
    });

    this._activeTab.set(tab);
  }

  public closeTab(tab: TabComponent): void {
    const prevTab: TabComponent | undefined = this.findPrevTab(tab);
    const nextTab: TabComponent | undefined = this.findNextTab(tab);

    tab.remove();

    if (prevTab) {
      this.openTab(prevTab);
    } else if (nextTab) {
      this.openTab(nextTab);
    } else {
      this._activeTab.set(null);
    }
  }

  public goToPrevTab(): boolean {
    return this.goToAdjacentTab('prev');
  }

  public goToNextTab(): boolean {
    return this.goToAdjacentTab('next');
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

  private findAdjacentTab(
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
    return this.findAdjacentTab(relativeTo, 'prev');
  }

  private findNextTab(relativeTo: TabComponent): TabComponent | undefined {
    return this.findAdjacentTab(relativeTo, 'next');
  }

  private goToAdjacentTab(side: 'prev' | 'next'): boolean {
    const currentTab = this._activeTab();
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
