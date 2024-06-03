import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { FirstErrorMessagePipe } from '@ui/forms';

@Component({
  selector: 'app-control-errors',
  standalone: true,
  imports: [FirstErrorMessagePipe],
  templateUrl: './control-errors.component.html',
  styleUrl: './control-errors.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlErrorsComponent {
  @Input({ required: true }) public errors!: ValidationErrors | null;
}
