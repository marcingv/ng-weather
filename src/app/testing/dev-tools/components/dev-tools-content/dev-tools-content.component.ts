import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DevToolsHttpCachePreviewComponent } from '@testing/dev-tools/components/dev-tools-http-cache-preview/dev-tools-http-cache-preview.component';

@Component({
  selector: 'app-dev-tools-content',
  standalone: true,
  imports: [DevToolsHttpCachePreviewComponent],
  templateUrl: './dev-tools-content.component.html',
  styleUrl: './dev-tools-content.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevToolsContentComponent {}
