import {
  Directive,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { ButtonType } from '@ui/buttons/types';

@Directive({
  selector: '[appButton]',
  standalone: true,
})
export class ButtonDirective implements OnChanges, OnInit {
  protected readonly CSS_CLASS: string = 'app-button';
  protected readonly THEMES: Record<ButtonType, string> = {
    primary: 'app-button-primary',
    secondary: 'app-button-secondary',
    transparent: 'app-button-transparent',
  };

  private renderer = inject(Renderer2);
  private elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  @Input() appButton: ButtonType = 'primary';

  public ngOnInit(): void {
    this.renderer.addClass(this.elementRef.nativeElement, this.CSS_CLASS);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const themeChange: SimpleChange | undefined = changes['appButton'];

    if (themeChange) {
      this.renderer.removeClass(
        this.elementRef.nativeElement,
        this.THEMES[themeChange.previousValue as ButtonType]
      );

      this.renderer.addClass(
        this.elementRef.nativeElement,
        this.THEMES[themeChange.currentValue as ButtonType]
      );
    }
  }
}
