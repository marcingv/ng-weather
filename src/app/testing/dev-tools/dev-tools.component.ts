import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * This component is here only to make it easier to test whole application during verification by the Angular Training Team.
 */
@Component({
  selector: 'app-dev-tools',
  standalone: true,
  imports: [],
  templateUrl: './dev-tools.component.html',
  styleUrl: './dev-tools.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevToolsComponent {}
