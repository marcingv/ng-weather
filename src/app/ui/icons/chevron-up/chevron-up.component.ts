import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-chevron-up',
  standalone: true,
  imports: [],
  templateUrl: './chevron-up.component.html',
  styleUrl: './chevron-up.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChevronUpComponent {
  @Input() public cssClass: string = 'inline-block size-4';
}
