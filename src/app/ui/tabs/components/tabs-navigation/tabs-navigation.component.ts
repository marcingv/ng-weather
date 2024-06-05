import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { TabComponent, TabId } from '@ui/tabs';
import { ButtonDirective } from '@ui/buttons/directives';
import { CloseIconComponent } from '@ui/icons/close-icon';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ScrollableTabItemDirective } from '@ui/tabs/directives/scrollable-tab-item.directive';
import {
  BehaviorSubject,
  combineLatestWith,
  delay,
  distinctUntilChanged,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-tabs-navigation',
  standalone: true,
  imports: [
    CommonModule,
    ButtonDirective,
    CloseIconComponent,
    NgTemplateOutlet,
    ScrollableTabItemDirective,
  ],
  templateUrl: './tabs-navigation.component.html',
  styleUrl: './tabs-navigation.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsNavigationComponent
  implements OnChanges, AfterViewInit, OnDestroy
{
  private readonly SCROLL_TO_TAB_DELAY_MS: number = 50;

  @Input({ required: true }) public tabs!: TabComponent[];
  @Input() public activeTab?: TabComponent | null;
  @Input() public autoScrollToTabs: boolean = true;

  @Output() public openTab: EventEmitter<TabComponent> =
    new EventEmitter<TabComponent>();

  @Output() public closeTab: EventEmitter<TabComponent> =
    new EventEmitter<TabComponent>();

  @ViewChildren(ScrollableTabItemDirective)
  private navigationTabs?: QueryList<ScrollableTabItemDirective>;

  private activeTabId$: BehaviorSubject<TabId | null> =
    new BehaviorSubject<TabId | null>(null);

  private destroyed$: Subject<void> = new Subject<void>();

  public ngOnChanges(): void {
    this.activeTabId$.next(this.activeTab?.tabId ?? null);
  }

  public ngAfterViewInit(): void {
    if (this.autoScrollToTabs) {
      this.registerAutoscrollToTabs();
    }
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private scrollToActiveTab(
    tabItems: ScrollableTabItemDirective[],
    activeTabId: string | null
  ): void {
    if (!activeTabId) {
      return;
    }

    const tabItem: ScrollableTabItemDirective | undefined = tabItems.find(
      (item: ScrollableTabItemDirective): boolean => item.tabId === activeTabId
    );

    if (tabItem) {
      tabItem.scrollIntoView();
    }
  }

  private registerAutoscrollToTabs(): void {
    if (!this.navigationTabs) {
      throw new Error(
        'Method called too soon - navigationTabs property is not yet initialized.'
      );
    }

    this.navigationTabs.changes
      .pipe(
        combineLatestWith(this.activeTabId$.pipe(distinctUntilChanged())),
        delay(this.SCROLL_TO_TAB_DELAY_MS),
        tap(
          ([tabItems, activeTabId]: [
            ScrollableTabItemDirective[],
            TabId | null,
          ]): void => {
            this.scrollToActiveTab(tabItems, activeTabId);
          }
        ),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }
}
