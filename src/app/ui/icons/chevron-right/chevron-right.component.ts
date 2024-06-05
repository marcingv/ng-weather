import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SvgIconComponent } from '../svg-icon.component';

@Component({
  selector: 'app-chevron-right',
  standalone: true,
  imports: [],
  templateUrl: './chevron-right.component.html',
  styleUrl: './chevron-right.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChevronRightComponent extends SvgIconComponent {}
