import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SvgIconComponent } from '../svg-icon.component';

@Component({
  selector: 'app-settings-icon',
  standalone: true,
  imports: [],
  templateUrl: './settings-icon.component.html',
  styleUrl: './settings-icon.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsIconComponent extends SvgIconComponent {}
