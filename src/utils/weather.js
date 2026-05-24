import {
  WiCloud,
  WiDaySunny,
  WiFog,
  WiRain,
  WiSnow,
  WiThunderstorm,
} from 'react-icons/wi';

export const units = {
  metric: { temp: 'C', wind: 'm/s', distance: 'km' },
  imperial: { temp: 'F', wind: 'mph', distance: 'mi' },
};

export const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
];

export const getWeatherIcon = (condition = '') => {
  const text = condition.toLowerCase();
  if (text.includes('thunder')) return WiThunderstorm;
  if (text.includes('rain') || text.includes('drizzle')) return WiRain;
  if (text.includes('snow')) return WiSnow;
  if (text.includes('mist') || text.includes('fog') || text.includes('haze')) return WiFog;
  if (text.includes('cloud')) return WiCloud;
  return WiDaySunny;
};

export const getWeatherTheme = (condition = '', isNight = false) => {
  if (isNight) return 'weather-night';
  const text = condition.toLowerCase();
  if (text.includes('rain') || text.includes('drizzle') || text.includes('thunder')) return 'weather-rain';
  if (text.includes('snow')) return 'weather-snow';
  if (text.includes('cloud') || text.includes('mist') || text.includes('fog') || text.includes('haze')) return 'weather-clouds';
  return 'weather-clear';
};

export const formatTime = (timestamp, timeZone) =>
  new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  }).format(new Date(timestamp * 1000));

export const formatDay = (timestamp, timeZone, weekday = 'short') =>
  new Intl.DateTimeFormat(undefined, {
    weekday,
    timeZone,
  }).format(new Date(timestamp * 1000));

export const formatHour = (timestamp, timeZone) =>
  new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    timeZone,
  }).format(new Date(timestamp * 1000));

export const visibilityValue = (meters, unitSystem) => {
  if (!meters && meters !== 0) return '--';
  const km = meters / 1000;
  return unitSystem === 'imperial' ? `${(km * 0.621371).toFixed(1)} mi` : `${km.toFixed(1)} km`;
};

export const aqiLabel = (aqi) => {
  const labels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very poor'];
  return labels[(aqi || 1) - 1] || 'Unknown';
};

export const rainProbability = (pop = 0) => Math.round(pop * 100);

export const formatTemperature = (value, unitSystem) =>
  value === undefined || value === null ? '--' : `${Math.round(value)}\u00b0${units[unitSystem].temp}`;

export const buildInsight = (weather, unitSystem) => {
  if (!weather?.current) return 'Live weather is unavailable right now, so Nimbus is using its saved demo report.';
  const current = weather.current;
  const condition = current.weather?.[0]?.main || 'weather';
  const temp = Math.round(current.temp);
  const rain = Math.max(...(weather.daily || []).slice(0, 3).map((day) => day.pop || 0));
  const tempUnit = units[unitSystem].temp;
  if (rain > 0.55) {
    return `Expect ${condition.toLowerCase()} around ${temp}\u00b0${tempUnit}. Rain risk is elevated over the next few days, so plan commute and outdoor time with a backup option.`;
  }
  if ((current.uvi || 0) >= 6) {
    return `It feels like ${Math.round(current.feels_like)}\u00b0${tempUnit} with strong UV. Hydration, shade, and sunscreen will matter during midday.`;
  }
  if ((current.wind_speed || 0) > 8) {
    return `Current ${condition.toLowerCase()} is paired with noticeable wind. Secure light outdoor items and expect cooler real-feel conditions.`;
  }
  return `A steady ${condition.toLowerCase()} pattern near ${temp}\u00b0${tempUnit}. Conditions look manageable, with no major short-term weather stress signals.`;
};
