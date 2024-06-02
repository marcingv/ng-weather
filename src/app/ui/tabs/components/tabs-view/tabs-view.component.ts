import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChildren,
  QueryList,
  signal,
} from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { tap } from 'rxjs';
import { NgClass } from '@angular/common';
import { ButtonDirective } from '@ui/buttons/directives';

@Component({
  selector: 'app-tabs-view',
  standalone: true,
  imports: [NgClass, ButtonDirective],
  templateUrl: './tabs-view.component.html',
  styleUrl: './tabs-view.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsViewComponent implements AfterContentInit {
  private tabs = signal<TabComponent[]>([]);

  public visibleTabs = computed(() => {
    return this.tabs().filter((oneTab: TabComponent) => !oneTab.isRemoved);
  });

  public activeTab = signal<TabComponent | null>(null);

  @ContentChildren(TabComponent) private declaredTabs!: QueryList<TabComponent>;

  public ngAfterContentInit(): void {
    this.setupTabs();
    this.declaredTabs.changes.pipe(tap(() => this.setupTabs())).subscribe();
  }

  private setupTabs(): void {
    this.tabs.set(this.declaredTabs.toArray());

    const activeTab: TabComponent | null = this.activeTab();
    if (!activeTab || !this.visibleTabs().includes(activeTab)) {
      this.openFirstTab();
    }
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

    const removedTabIdx: number = this.visibleTabs().indexOf(tab);
    const prevTab: TabComponent | undefined =
      this.visibleTabs()[removedTabIdx - 1];
    const nextTab: TabComponent | undefined =
      this.visibleTabs()[removedTabIdx + 1];

    tab.remove();
    this.tabs.set([...this.tabs()]);

    if (prevTab) {
      this.openTab(prevTab);
    } else if (nextTab) {
      this.openTab(nextTab);
    } else {
      this.activeTab.set(null);
    }
  }

  protected onTabItemClick(tab: TabComponent): void {
    this.openTab(tab);
  }
}
