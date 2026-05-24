const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const REVERSE_GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/reverse';
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

const requestJson = async (url, params = {}) => {
  const requestUrl = new URL(url);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      requestUrl.searchParams.set(key, value);
    }
  });

  const response = await fetch(requestUrl);
  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new Error(message || `Weather request failed with ${response.status}`);
  }
  return response.json();
};

const normalizePlace = (place) => ({
  name: place.name,
  state: place.admin1 || place.admin2 || '',
  country: place.country_code || place.country || '',
  lat: place.latitude,
  lon: place.longitude,
});

const temperatureUnit = (units) => (units === 'imperial' ? 'fahrenheit' : 'celsius');
const windSpeedUnit = (units) => (units === 'imperial' ? 'mph' : 'ms');

const offsetToIso = (seconds = 0) => {
  const sign = seconds >= 0 ? '+' : '-';
  const absolute = Math.abs(seconds);
  const hours = String(Math.floor(absolute / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((absolute % 3600) / 60)).padStart(2, '0');
  return `${sign}${hours}:${minutes}`;
};

const toUnix = (localTime, offsetSeconds = 0) => {
  if (!localTime) return undefined;
  return Math.floor(new Date(`${localTime}${offsetToIso(offsetSeconds)}`).getTime() / 1000);
};

const weatherCodeInfo = (code = 0) => {
  if (code === 0) return { main: 'Clear', description: 'clear sky' };
  if ([1, 2].includes(code)) return { main: 'Clouds', description: 'partly cloudy' };
  if (code === 3) return { main: 'Clouds', description: 'overcast clouds' };
  if ([45, 48].includes(code)) return { main: 'Fog', description: 'foggy conditions' };
  if ([51, 53, 55, 56, 57].includes(code)) return { main: 'Drizzle', description: 'drizzle' };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { main: 'Rain', description: 'rain showers' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { main: 'Snow', description: 'snow showers' };
  if ([95, 96, 99].includes(code)) return { main: 'Thunderstorm', description: 'thunderstorms' };
  return { main: 'Clouds', description: 'variable conditions' };
};

const valueAt = (collection, index) => collection?.[index];

const buildHourly = (hourly = {}, offsetSeconds = 0) =>
  (hourly.time || []).map((time, index) => ({
    dt: toUnix(time, offsetSeconds),
    temp: valueAt(hourly.temperature_2m, index),
    feels_like: valueAt(hourly.apparent_temperature, index),
    pressure: valueAt(hourly.pressure_msl, index),
    humidity: valueAt(hourly.relative_humidity_2m, index),
    wind_speed: valueAt(hourly.wind_speed_10m, index),
    wind_deg: valueAt(hourly.wind_direction_10m, index),
    pop: (valueAt(hourly.precipitation_probability, index) || 0) / 100,
    uvi: valueAt(hourly.uv_index, index),
    visibility: valueAt(hourly.visibility, index),
    weather: [weatherCodeInfo(valueAt(hourly.weather_code, index))],
  }));

const buildDaily = (daily = {}, offsetSeconds = 0) =>
  (daily.time || []).map((date, index) => {
    const min = valueAt(daily.temperature_2m_min, index);
    const max = valueAt(daily.temperature_2m_max, index);

    return {
      dt: toUnix(`${date}T12:00`, offsetSeconds),
      sunrise: toUnix(valueAt(daily.sunrise, index), offsetSeconds),
      sunset: toUnix(valueAt(daily.sunset, index), offsetSeconds),
      temp: {
        min,
        max,
        day: min !== undefined && max !== undefined ? (min + max) / 2 : max,
      },
      feels_like: { day: max },
      pressure: undefined,
      humidity: undefined,
      wind_speed: valueAt(daily.wind_speed_10m_max, index),
      pop: (valueAt(daily.precipitation_probability_max, index) || 0) / 100,
      uvi: valueAt(daily.uv_index_max, index),
      weather: [weatherCodeInfo(valueAt(daily.weather_code, index))],
    };
  });

const aqiCategory = (usAqi) => {
  if (usAqi === undefined || usAqi === null) return 1;
  if (usAqi <= 50) return 1;
  if (usAqi <= 100) return 2;
  if (usAqi <= 150) return 3;
  if (usAqi <= 200) return 4;
  return 5;
};

const calculateDewPoint = (temperature, humidity, units = 'metric') => {
  if (temperature === undefined || humidity === undefined) return undefined;
  const tempC = units === 'imperial' ? ((temperature - 32) * 5) / 9 : temperature;
  const gamma = Math.log(humidity / 100) + (17.625 * tempC) / (243.04 + tempC);
  const dewC = (243.04 * gamma) / (17.625 - gamma);
  return units === 'imperial' ? (dewC * 9) / 5 + 32 : dewC;
};

const normalizeAirQuality = (airQuality = {}) => {
  const current = airQuality.current || {};
  return {
    main: {
      aqi: aqiCategory(current.us_aqi),
      us_aqi: current.us_aqi,
    },
    components: {
      pm2_5: current.pm2_5,
      pm10: current.pm10,
      o3: current.ozone,
    },
  };
};

export const searchLocations = async (query, limit = 6) => {
  const value = query.trim();
  if (!value) return [];

  const data = await requestJson(GEOCODING_URL, {
    name: value,
    count: limit,
    language: 'en',
    format: 'json',
  });

  return (data.results || [])
    .map(normalizePlace)
    .filter((place) => Number.isFinite(place.lat) && Number.isFinite(place.lon));
};

export const getWeatherBundle = async ({ lat, lon, units = 'metric' }) => {
  const [forecast, airQuality] = await Promise.all([
    requestJson(FORECAST_URL, {
      latitude: lat,
      longitude: lon,
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'precipitation',
        'weather_code',
        'cloud_cover',
        'pressure_msl',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m',
      ].join(','),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'precipitation_probability',
        'weather_code',
        'pressure_msl',
        'wind_speed_10m',
        'wind_direction_10m',
        'uv_index',
        'visibility',
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'sunrise',
        'sunset',
        'uv_index_max',
        'precipitation_probability_max',
        'wind_speed_10m_max',
      ].join(','),
      timezone: 'auto',
      forecast_days: 7,
      temperature_unit: temperatureUnit(units),
      wind_speed_unit: windSpeedUnit(units),
      precipitation_unit: 'mm',
    }),
    requestJson(AIR_QUALITY_URL, {
      latitude: lat,
      longitude: lon,
      current: 'us_aqi,pm2_5,pm10,ozone',
      timezone: 'auto',
    }).catch(() => null),
  ]);

  const offsetSeconds = forecast.utc_offset_seconds || 0;
  const rawHourly = buildHourly(forecast.hourly, offsetSeconds);
  const daily = buildDaily(forecast.daily, offsetSeconds);
  const currentTimestamp = toUnix(forecast.current?.time, offsetSeconds) || rawHourly[0]?.dt;
  const firstForecastIndex = rawHourly.findIndex((hour) => hour.dt >= currentTimestamp - 1800);
  const hourly = rawHourly.slice(Math.max(0, firstForecastIndex), Math.max(0, firstForecastIndex) + 24);
  const nearestHour = hourly[0] || rawHourly[0] || {};
  const currentWeather = weatherCodeInfo(forecast.current?.weather_code);

  return {
    lat,
    lon,
    timezone: forecast.timezone || 'UTC',
    current: {
      dt: currentTimestamp,
      sunrise: daily[0]?.sunrise,
      sunset: daily[0]?.sunset,
      temp: forecast.current?.temperature_2m,
      feels_like: forecast.current?.apparent_temperature,
      pressure: forecast.current?.pressure_msl || forecast.current?.surface_pressure,
      humidity: forecast.current?.relative_humidity_2m,
      dew_point: calculateDewPoint(forecast.current?.temperature_2m, forecast.current?.relative_humidity_2m, units),
      uvi: nearestHour.uvi ?? daily[0]?.uvi,
      clouds: forecast.current?.cloud_cover,
      visibility: nearestHour.visibility,
      wind_speed: forecast.current?.wind_speed_10m,
      wind_deg: forecast.current?.wind_direction_10m,
      weather: [currentWeather],
    },
    hourly,
    daily,
    airQuality: normalizeAirQuality(airQuality),
  };
};

export const reverseGeocode = async ({ lat, lon }) => {
  const data = await requestJson(REVERSE_GEOCODING_URL, {
    latitude: lat,
    longitude: lon,
    language: 'en',
    format: 'json',
  });
  return data.results?.[0] ? normalizePlace(data.results[0]) : null;
};

export const demoWeather = {
  lat: 28.6139,
  lon: 77.209,
  timezone: 'Asia/Kolkata',
  current: {
    dt: 1779510600,
    sunrise: 1779475800,
    sunset: 1779524100,
    temp: 32,
    feels_like: 35,
    pressure: 1007,
    humidity: 44,
    dew_point: 18,
    uvi: 7.1,
    clouds: 28,
    visibility: 9000,
    wind_speed: 4.2,
    wind_deg: 230,
    weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
  },
  hourly: Array.from({ length: 24 }, (_, index) => ({
    dt: 1779510600 + index * 3600,
    temp: 32 - Math.sin(index / 3) * 4,
    feels_like: 34,
    pressure: 1007,
    humidity: 44 + Math.round(Math.sin(index / 2) * 12),
    wind_speed: 3 + Math.cos(index / 4) * 2,
    pop: Math.max(0, Math.sin(index / 5) * 0.45),
    weather: [{ main: index > 14 ? 'Clouds' : 'Clear', description: index > 14 ? 'few clouds' : 'clear sky' }],
  })),
  daily: Array.from({ length: 7 }, (_, index) => ({
    dt: 1779510600 + index * 86400,
    sunrise: 1779475800 + index * 86400,
    sunset: 1779524100 + index * 86400,
    temp: { min: 23 + index, max: 34 + Math.round(Math.sin(index) * 3), day: 31 + index },
    feels_like: { day: 35 },
    pressure: 1006 + index,
    humidity: 42 + index * 3,
    wind_speed: 3.4 + index / 2,
    pop: [0.05, 0.12, 0.32, 0.48, 0.18, 0.08, 0.22][index],
    uvi: 6 + index / 4,
    weather: [{ main: index === 3 ? 'Rain' : index > 4 ? 'Clouds' : 'Clear', description: index === 3 ? 'light rain' : 'clear sky' }],
  })),
  alerts: [{ event: 'Demo weather data', description: 'Live weather could not be loaded, so Nimbus is showing demo data.' }],
  airQuality: { main: { aqi: 2, us_aqi: 72 }, components: { pm2_5: 18, pm10: 42, o3: 76 } },
};
