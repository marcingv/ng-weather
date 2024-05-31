import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  Signal,
} from '@angular/core';
import { WeatherService } from '@features/data-access-forecasts/services';
import { RouterLink } from '@angular/router';
import { ConditionsAndZip, ZipCode } from 'src/app/core/types';
import { CommonModule } from '@angular/common';
import { ButtonDirective } from '@ui/buttons/directives';
import { Paths } from '@core/router/paths';

@Component({
  selector: 'app-current-conditions',
  standalone: true,
  templateUrl: './current-conditions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, ButtonDirective],
})
export class CurrentConditionsComponent implements OnChanges {
  protected readonly Paths = Paths;
  protected readonly weatherService: WeatherService = inject(WeatherService);

  @Input({ required: true }) public zipcode!: ZipCode;
  @Output() public closeClicked: EventEmitter<void> = new EventEmitter<void>();

  protected currentConditions!: Signal<ConditionsAndZip | null>;

  public ngOnChanges(): void {
    this.currentConditions = this.weatherService.getConditions(this.zipcode);
  }

  public onRemoveLocation($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();

    this.closeClicked.next();
  }
}
