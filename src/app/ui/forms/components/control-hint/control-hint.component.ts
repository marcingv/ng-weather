import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-control-hint',
  standalone: true,
  imports: [],
  templateUrl: './control-hint.component.html',
  styleUrl: './control-hint.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlHintComponent {}
