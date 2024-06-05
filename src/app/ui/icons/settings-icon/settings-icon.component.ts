import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-settings-icon',
  standalone: true,
  imports: [],
  templateUrl: './settings-icon.component.html',
  styleUrl: './settings-icon.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsIconComponent {
  @Input() public cssClass: string = 'inline-block size-4';
}
