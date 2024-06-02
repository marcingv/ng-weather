import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-empty-collection-placeholder',
  standalone: true,
  imports: [],
  templateUrl: './empty-collection-placeholder.component.html',
  styleUrl: './empty-collection-placeholder.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyCollectionPlaceholderComponent {
  protected readonly DEFAULT_MESSAGE: string = 'Collection is empty';
}
