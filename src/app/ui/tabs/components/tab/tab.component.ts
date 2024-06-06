import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  TabLabelTemplateDirective,
  TabLazyContentTemplateDirective,
} from '../../directives';
import { NgTemplateOutlet } from '@angular/common';
import { TabId } from '../../types';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent {
  @Input({ required: true }) public tabId!: TabId;
  @Input() public label?: string;

  @Output() public tabRemoved: EventEmitter<void> = new EventEmitter<void>();
  @Output() public tabShown: EventEmitter<void> = new EventEmitter<void>();
  @Output() public tabHidden: EventEmitter<void> = new EventEmitter<void>();

  @ContentChild(TabLabelTemplateDirective, { static: true })
  public labelTemplate?: TabLabelTemplateDirective;

  @ContentChild(TabLazyContentTemplateDirective, { static: true })
  public lazyContentTemplate?: TabLazyContentTemplateDirective;

  protected activeSignal: WritableSignal<boolean> = signal<boolean>(false);
  protected removedSignal: WritableSignal<boolean> = signal<boolean>(false);

  @HostBinding('style.display') get tabStyle(): string {
    if (this.isRemoved) {
      return 'none';
    }

    return this.isActive ? 'block' : 'none';
  }

  public get isActive(): boolean {
    return this.activeSignal();
  }

  public get isRemoved(): boolean {
    return this.removedSignal();
  }

  public show(): void {
    this.activeSignal.set(true);
    this.tabShown.next();
  }

  public hide(): void {
    this.activeSignal.set(false);
    this.tabHidden.next();
  }

  public remove(): void {
    this.removedSignal.set(true);
    this.tabRemoved.next();
  }
}
