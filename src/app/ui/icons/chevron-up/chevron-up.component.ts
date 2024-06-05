import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SvgIconComponent } from '../svg-icon.component';

@Component({
  selector: 'app-chevron-up',
  standalone: true,
  imports: [],
  templateUrl: './chevron-up.component.html',
  styleUrl: './chevron-up.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChevronUpComponent extends SvgIconComponent {}
