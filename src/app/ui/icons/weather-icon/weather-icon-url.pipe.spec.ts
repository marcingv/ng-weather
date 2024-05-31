import { WeatherIconUrlPipe } from './weather-icon-url.pipe';
import { Weather } from '@core/types';
import { WeatherFactory } from '@testing/weather.factory';

describe('WeatherIconUrlPipe', (): void => {
  const pipe: WeatherIconUrlPipe = new WeatherIconUrlPipe();

  const clearSky: Weather = WeatherFactory.createClearSkyInstance();
  const thunderstorm: Weather = WeatherFactory.createThunderstormInstance();
  const drizzle: Weather = WeatherFactory.createDrizzleInstance();
  const rain: Weather = WeatherFactory.createRainInstance();
  const lightRain: Weather = WeatherFactory.createLightRainInstance();
  const heavyRain: Weather = WeatherFactory.createHeavyRainInstance();
  const snow: Weather = WeatherFactory.createSnowInstance();
  const atmosphere: Weather = WeatherFactory.createAtmosphereInstance();
  const clouds: Weather = WeatherFactory.createCloudsInstance();

  it('create an instance', (): void => {
    expect(pipe).toBeTruthy();
  });

  it('should provide icon url for each weather type', () => {
    expect(pipe.transform(clearSky.id)).toEqual(
      '/assets/weather/art_clear.png'
    );

    expect(pipe.transform(thunderstorm.id)).toEqual(
      '/assets/weather/art_storm.png'
    );

    expect(pipe.transform(drizzle.id)).toEqual(
      '/assets/weather/art_light_rain.png'
    );

    expect(pipe.transform(rain.id)).toEqual('/assets/weather/art_rain.png');

    expect(pipe.transform(lightRain.id)).toEqual(
      '/assets/weather/art_light_rain.png'
    );

    expect(pipe.transform(heavyRain.id)).toEqual(
      '/assets/weather/art_rain.png'
    );

    expect(pipe.transform(snow.id)).toEqual('/assets/weather/art_snow.png');

    expect(pipe.transform(atmosphere.id)).toEqual(
      '/assets/weather/art_fog.png'
    );

    expect(pipe.transform(clouds.id)).toEqual('/assets/weather/art_clouds.png');
  });
});
