import { Pipe, PipeTransform } from '@angular/core';
import { Weather } from '@core/types';

@Pipe({
  name: 'weatherIconUrl',
  standalone: true,
})
export class WeatherIconUrlPipe implements PipeTransform {
  private readonly ICONS_DIR = '/assets/weather';

  public transform(weatherId: Weather['id']): string {
    return `${this.ICONS_DIR}/${this.getIconFileName(weatherId)}`;
  }

  private getIconFileName(id: Weather['id']): string {
    if (id >= 200 && id <= 232) {
      return 'art_storm.png';
    } else if (id >= 300 && id <= 321) {
      return 'art_light_rain.png';
    } else if (id >= 501 && id <= 511) {
      return 'art_rain.png';
    } else if (id === 500 || (id >= 520 && id <= 531)) {
      return 'art_light_rain.png';
    } else if (id >= 600 && id <= 622) {
      return 'art_snow.png';
    } else if (id >= 801 && id <= 804) {
      return 'art_clouds.png';
    } else if (id >= 701 && id <= 781) {
      return 'art_fog.png';
    } else {
      return 'art_clear.png';
    }
  }
}
