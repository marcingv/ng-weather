import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SvgIconComponent } from '../svg-icon.component';

@Component({
  selector: 'app-chevron-left',
  standalone: true,
  imports: [],
  templateUrl: './chevron-left.component.html',
  styleUrl: './chevron-left.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChevronLeftComponent extends SvgIconComponent {}
