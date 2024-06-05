import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-chevron-down',
  standalone: true,
  imports: [],
  templateUrl: './chevron-down.component.html',
  styleUrl: './chevron-down.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChevronDownComponent {
  @Input() public cssClass: string = 'inline-block size-4';
}
