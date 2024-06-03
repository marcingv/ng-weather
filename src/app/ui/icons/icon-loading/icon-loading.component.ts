import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-loading.component.html',
  styleUrl: './icon-loading.component.css',
})
export class IconLoadingComponent {
  @Input() public cssClass: string = 'inline-block size-4';
}
