import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dev-tools-content',
  standalone: true,
  imports: [],
  templateUrl: './dev-tools-content.component.html',
  styleUrl: './dev-tools-content.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevToolsContentComponent {}
