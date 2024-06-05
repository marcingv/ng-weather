import { Directive, ElementRef, Input } from '@angular/core';
import { TabId } from '@ui/tabs';

@Directive({
  selector: '[appScrollableTabItem]',
  standalone: true,
  exportAs: 'scrollableTabItem',
})
export class ScrollableTabItemDirective {
  @Input({ alias: 'appScrollableTabItem', required: true })
  public tabId!: TabId;

  public constructor(private el: ElementRef<HTMLElement>) {}

  public scrollIntoView(): void {
    this.el.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }
}
