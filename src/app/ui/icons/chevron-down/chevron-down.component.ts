import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SvgIconComponent } from '../svg-icon.component';

@Component({
  selector: 'app-chevron-down',
  standalone: true,
  imports: [],
  templateUrl: './chevron-down.component.html',
  styleUrl: './chevron-down.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChevronDownComponent extends SvgIconComponent {}
