import { Weather } from '@core/types';

export class WeatherFactory {
  public static createInstance(params?: Partial<Weather>): Weather {
    if (!params) {
      params = {};
    }

    return {
      id: params.id ?? 800,
      icon: '01d',
      main: 'Clear',
      description: 'clear sky',
    };
  }

  public static createClearSkyInstance(): Weather {
    return {
      id: 800,
      icon: '01d',
      main: 'Clear',
      description: 'clear sky',
    };
  }

  public static createThunderstormInstance(): Weather {
    return {
      id: 200,
      icon: '11d',
      main: 'Thunderstorm',
      description: 'thunderstorm with light rain',
    };
  }

  public static createDrizzleInstance(): Weather {
    return {
      id: 300,
      icon: '09d',
      main: 'Drizzle',
      description: 'light intensity drizzle',
    };
  }

  public static createRainInstance(): Weather {
    return {
      id: 501,
      icon: '10d',
      main: 'Rain',
      description: 'moderate rain',
    };
  }

  public static createHeavyRainInstance(): Weather {
    return {
      id: 502,
      icon: '10d',
      main: 'Rain',
      description: 'heavy intensity rain',
    };
  }

  public static createLightRainInstance(): Weather {
    return {
      id: 500,
      icon: '10d',
      main: 'Rain',
      description: 'light rain',
    };
  }

  public static createSnowInstance(): Weather {
    return {
      id: 600,
      icon: '13d',
      main: 'Snow',
      description: 'light snow',
    };
  }

  public static createAtmosphereInstance(): Weather {
    return {
      id: 701,
      icon: '50d',
      main: 'Mist',
      description: 'mist',
    };
  }

  public static createCloudsInstance(): Weather {
    return {
      id: 801,
      icon: '02d',
      main: 'Clouds',
      description: 'few clouds: 25-50%',
    };
  }
}
