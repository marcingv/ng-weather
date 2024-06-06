import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  effect,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  QueryList,
  Signal,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ButtonDirective } from '@ui/buttons/directives';
import { CloseIconComponent } from '@ui/icons/close-icon';
import { TabId } from '../../types';
import { TabsNavigationComponent } from '../tabs-navigation';
import { TabsService } from '../../services';
import { TabComponent } from '../tab';

@Component({
  selector: 'app-tabs-view',
  standalone: true,
  imports: [
    CommonModule,
    ButtonDirective,
    CloseIconComponent,
    TabsNavigationComponent,
  ],
  providers: [TabsService],
  templateUrl: './tabs-view.component.html',
  styleUrl: './tabs-view.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsViewComponent implements OnChanges, AfterViewInit {
  protected tabsService: TabsService = inject(TabsService);

  @Input() public autoScrollToTabs: boolean = true;
  @Input() public showNavigationButtons: boolean = true;
  @Input() public autoShowNavigationButtons: boolean = true;

  @Input() public activeTabId?: TabId;
  @Output() public activeTabIdChange: EventEmitter<TabId | undefined> =
    new EventEmitter<TabId | undefined>();

  @ContentChildren(TabComponent) private declaredTabs!: QueryList<TabComponent>;

  protected visibleTabs: Signal<TabComponent[]> = this.tabsService.visibleTabs;
  protected activeTab: Signal<TabComponent | null> = this.tabsService.activeTab;

  public constructor() {
    effect((): void => {
      this.activeTabId = this.activeTab()?.tabId;
      this.activeTabIdChange.next(this.activeTabId);
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const activeTabIdChange: SimpleChange | undefined = changes['activeTabId'];
    if (activeTabIdChange && activeTabIdChange.currentValue) {
      this.tabsService.changeActiveTabTo(activeTabIdChange.currentValue);
    }
  }

  public ngAfterViewInit(): void {
    this.setupTabs();
    this.declaredTabs.changes.pipe(tap(() => this.setupTabs())).subscribe();
  }

  private setupTabs(): void {
    this.tabsService.setupTabs(this.declaredTabs.toArray(), this.activeTabId);
  }
}
