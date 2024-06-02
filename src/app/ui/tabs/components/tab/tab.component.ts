import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  signal,
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

  protected activeSignal = signal<boolean>(false);
  protected removedSignal = signal<boolean>(false);

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
  }
}
