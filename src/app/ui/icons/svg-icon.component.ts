import { Directive, Input } from '@angular/core';

@Directive()
export abstract class SvgIconComponent {
  @Input() public cssClass: string = 'inline-block size-4';
}
