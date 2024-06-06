import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeSpan',
  standalone: true,
})
export class TimeSpanPipe implements PipeTransform {
  private readonly ONE_SECOND_MILLIS: number = 1000;
  private readonly ONE_MINUTE_MILLIS: number = 1000 * 60;
  private readonly ONE_HOUR_MILLIS: number = 1000 * 60 * 60;

  public transform(timeInMillis: number): string {
    const parts: string[] = [];
    let millisLeft: number = timeInMillis;

    const numOfHours = Math.floor(millisLeft / this.ONE_HOUR_MILLIS);
    if (numOfHours) {
      parts.push(`${numOfHours}h`);
      millisLeft -= numOfHours * this.ONE_HOUR_MILLIS;
    }

    const numOfMinutes = Math.floor(millisLeft / this.ONE_MINUTE_MILLIS);
    if (numOfMinutes) {
      parts.push(`${numOfMinutes}m`);
      millisLeft -= numOfMinutes * this.ONE_MINUTE_MILLIS;
    }

    const numOfSeconds = Math.floor(millisLeft / this.ONE_SECOND_MILLIS);
    if (numOfSeconds) {
      parts.push(`${numOfSeconds}s`);
      millisLeft -= numOfSeconds * this.ONE_SECOND_MILLIS;
    }

    const numOfMillis = millisLeft;

    return parts.length ? parts.join(' ') : `${numOfMillis}ms`;
  }
}
