import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent {
  @Input({ required: true }) public tabId!: string;
  @Input() public label?: string;

  @Output() public removed: EventEmitter<void> = new EventEmitter<void>();

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
  }

  public hide(): void {
    this.activeSignal.set(false);
  }

  public remove(): void {
    this.removedSignal.set(true);
    this.removed.next();
  }
}
