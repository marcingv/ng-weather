import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from '../svg-icon.component';

@Component({
  selector: 'app-icon-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-loading.component.html',
  styleUrl: './icon-loading.component.css',
})
export class IconLoadingComponent extends SvgIconComponent {}
