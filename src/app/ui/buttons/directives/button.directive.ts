import { Directive, HostBinding, Input } from '@angular/core';
import { ButtonType } from '@ui/buttons/types';

@Directive({
  selector: '[appButton]',
  standalone: true,
})
export class ButtonDirective {
  protected readonly CSS_CLASS: string = 'app-button';
  protected readonly THEMES: Record<ButtonType, string> = {
    primary: 'app-button-primary',
    secondary: 'app-button-secondary',
    transparent: 'app-button-transparent',
    white: 'app-button-white',
  };

  @Input() public appButton: ButtonType = 'primary';

  @HostBinding('class') get buttonCssClass(): string {
    return this.CSS_CLASS + ' ' + this.THEMES[this.appButton];
  }
}
