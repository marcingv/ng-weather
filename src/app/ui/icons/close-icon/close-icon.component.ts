import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SvgIconComponent } from '../svg-icon.component';

@Component({
  selector: 'app-close-icon',
  standalone: true,
  imports: [],
  templateUrl: './close-icon.component.html',
  styleUrl: './close-icon.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CloseIconComponent extends SvgIconComponent {}
