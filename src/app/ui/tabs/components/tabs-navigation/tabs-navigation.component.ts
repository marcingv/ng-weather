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
  map,
  Observable,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { ChevronLeftComponent } from '@ui/icons/chevron-left';
import { ChevronRightComponent } from '@ui/icons/chevron-right';

@Component({
  selector: 'app-tabs-navigation',
  standalone: true,
  imports: [
    CommonModule,
    ButtonDirective,
    CloseIconComponent,
    NgTemplateOutlet,
    ScrollableTabItemDirective,
    ChevronLeftComponent,
    ChevronRightComponent,
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
  @Input() public showNavigationButtons: boolean = true;

  @Output() public openTab: EventEmitter<TabComponent> =
    new EventEmitter<TabComponent>();

  @Output() public closeTab: EventEmitter<TabComponent> =
    new EventEmitter<TabComponent>();

  @Output() public goToPrevTab: EventEmitter<void> = new EventEmitter<void>();
  @Output() public goToNextTab: EventEmitter<void> = new EventEmitter<void>();

  @ViewChildren(ScrollableTabItemDirective)
  private navigationTabs?: QueryList<ScrollableTabItemDirective>;

  private activeTab$: BehaviorSubject<TabComponent | null> =
    new BehaviorSubject<TabComponent | null>(null);

  protected isFirstTabActive$: Observable<boolean> = this.activeTab$.pipe(
    map((activeTab): boolean => {
      return !!activeTab && !!this.tabs[0] && this.tabs[0] === activeTab;
    })
  );

  protected isLastTabActive$: Observable<boolean> = this.activeTab$.pipe(
    map((activeTab): boolean => {
      return (
        !!activeTab &&
        !!this.tabs[this.tabs.length - 1] &&
        this.tabs[this.tabs.length - 1] === activeTab
      );
    })
  );

  private destroyed$: Subject<void> = new Subject<void>();

  public ngOnChanges(): void {
    this.activeTab$.next(this.activeTab ?? null);
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
    activeTabId: TabId | null
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
        combineLatestWith(
          this.activeTab$.pipe(
            map(tab => tab?.tabId ?? null),
            distinctUntilChanged()
          )
        ),
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

  protected onTabClicked(oneTab: TabComponent, $event?: MouseEvent): void {
    $event?.preventDefault();
    $event?.stopPropagation();

    this.openTab.next(oneTab);
  }

  protected onTabCloseClicked(oneTab: TabComponent, $event: MouseEvent): void {
    $event?.preventDefault();
    $event?.stopPropagation();

    this.closeTab.next(oneTab);
  }
}
