import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ENVIRONMENT } from '@environments/environment';
import { DevToolsComponent } from '@testing/dev-tools';
import { ToastsContainerComponent } from '@ui/toasts';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, DevToolsComponent, ToastsContainerComponent],
})
export class AppComponent {
  protected appDevToolsEnabled: boolean = ENVIRONMENT.ENABLE_APP_DEV_TOOLS;
}
