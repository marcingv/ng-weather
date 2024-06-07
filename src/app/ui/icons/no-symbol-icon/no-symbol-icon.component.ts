import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SvgIconComponent } from '@ui/icons/svg-icon.component';

@Component({
  selector: 'app-no-symbol-icon',
  standalone: true,
  imports: [],
  templateUrl: './no-symbol-icon.component.html',
  styleUrl: './no-symbol-icon.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoSymbolIconComponent extends SvgIconComponent {}
